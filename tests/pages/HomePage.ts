import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly writePostButton: Locator;
  readonly postCards: Locator;
  readonly categoryButtons: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly clearFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.writePostButton = page.locator('text=Write Post');
    this.postCards = page.locator('a[href^="/posts/"]');
    this.categoryButtons = page.locator('text=All, text=Tech, text=Life, text=Thoughts');
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.searchButton = page.locator('button:has-text("Search")');
    this.clearFilterButton = page.locator('text=Clear Filter');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'load' });
  }

  async clickWritePost() {
    await this.writePostButton.click();
  }

  async clickCategory(category: string) {
    await this.page.locator(`text=${category}`).first().click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async clickClearFilter() {
    await this.clearFilterButton.click();
  }

  async getFirstPostLink(): Promise<string> {
    return await this.postCards.first().getAttribute('href') || '';
  }

  async deletePost(title: string) {
    const deleteButton = this.page.locator(`article:has-text("${title}") button:has-text("Delete")`).first();
    await deleteButton.click();
  }

  async deleteFirstPost() {
    const deleteButton = this.page.locator('article button:has-text("Delete")').first();
    await deleteButton.click();
  }
}
