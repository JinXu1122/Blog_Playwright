import { Page, Locator } from '@playwright/test';

export class PostDetailPage {
  readonly page: Page;
  readonly article: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.article = page.locator('article');
    this.deleteButton = page.locator('button:has-text("Delete")');
  }

  async goto(id: string) {
    await this.page.goto(`/posts/${id}`);
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async isArticleVisible(): Promise<boolean> {
    return await this.article.isVisible();
  }
}
