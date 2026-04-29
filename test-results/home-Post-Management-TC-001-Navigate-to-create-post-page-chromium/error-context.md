# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Post Management >> TC-001: Navigate to create post page
- Location: tests/home.spec.ts:11:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('text=Write Post') resolved to 2 elements:
    1) <a href="/create" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Write Post</a> aka getByRole('navigation').getByRole('link', { name: 'Write Post' })
    2) <a href="/create" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Write Post</a> aka getByRole('main').getByRole('link', { name: 'Write Post' })

Call log:
  - waiting for locator('text=Write Post')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e4]:
      - generic [ref=e5]:
        - link "My Blog" [ref=e6] [cursor=pointer]:
          - /url: /
        - link "Write Post" [ref=e7] [cursor=pointer]:
          - /url: /create
      - generic [ref=e8]:
        - generic [ref=e9]:
          - textbox "Search posts..." [ref=e10]
          - button "Search" [ref=e11]
        - generic [ref=e12]:
          - link "All" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Tech" [ref=e14] [cursor=pointer]:
            - /url: /?category=tech
          - link "Life" [ref=e15] [cursor=pointer]:
            - /url: /?category=life
          - link "Thoughts" [ref=e16] [cursor=pointer]:
            - /url: /?category=thoughts
  - main [ref=e17]:
    - generic [ref=e18]:
      - heading "No posts yet" [level=2] [ref=e19]
      - paragraph [ref=e20]: Start writing your first post!
      - link "Write Post" [ref=e21] [cursor=pointer]:
        - /url: /create
  - contentinfo [ref=e22]:
    - paragraph [ref=e24]: Next.js Full-stack Blog
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e34]
```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class HomePage {
  4  |   readonly page: Page;
  5  |   readonly writePostButton: Locator;
  6  |   readonly postCards: Locator;
  7  |   readonly categoryButtons: Locator;
  8  |   readonly searchInput: Locator;
  9  |   readonly searchButton: Locator;
  10 |   readonly clearFilterButton: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.writePostButton = page.locator('text=Write Post');
  15 |     this.postCards = page.locator('a[href^="/posts/"]');
  16 |     this.categoryButtons = page.locator('text=All, text=Tech, text=Life, text=Thoughts');
  17 |     this.searchInput = page.locator('input[placeholder*="Search"]');
  18 |     this.searchButton = page.locator('button:has-text("Search")');
  19 |     this.clearFilterButton = page.locator('text=Clear Filter');
  20 |   }
  21 | 
  22 |   async goto() {
  23 |     await this.page.goto('/', { waitUntil: 'load' });
  24 |   }
  25 | 
  26 |   async clickWritePost() {
> 27 |     await this.writePostButton.click();
     |                                ^ Error: locator.click: Error: strict mode violation: locator('text=Write Post') resolved to 2 elements:
  28 |   }
  29 | 
  30 |   async clickCategory(category: string) {
  31 |     await this.page.locator(`text=${category}`).first().click();
  32 |   }
  33 | 
  34 |   async search(query: string) {
  35 |     await this.searchInput.fill(query);
  36 |     await this.searchButton.click();
  37 |   }
  38 | 
  39 |   async clickClearFilter() {
  40 |     await this.clearFilterButton.click();
  41 |   }
  42 | 
  43 |   async getFirstPostLink(): Promise<string> {
  44 |     return await this.postCards.first().getAttribute('href') || '';
  45 |   }
  46 | 
  47 |   async deletePost(title: string) {
  48 |     const deleteButton = this.page.locator(`article:has-text("${title}") button:has-text("Delete")`).first();
  49 |     await deleteButton.click();
  50 |   }
  51 | 
  52 |   async deleteFirstPost() {
  53 |     const deleteButton = this.page.locator('article button:has-text("Delete")').first();
  54 |     await deleteButton.click();
  55 |   }
  56 | }
  57 | 
```