import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly noPostsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.searchButton = page.locator('button:has-text("Search")');
    this.noPostsMessage = page.locator('text=No posts yet');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async getPostCount(): Promise<number> {
    const response = await this.page.request.get('/api/posts');
    const posts = await response.json();
    return posts.length;
  }

  async isNoPostsMessageVisible(): Promise<boolean> {
    return await this.noPostsMessage.isVisible();
  }
}
