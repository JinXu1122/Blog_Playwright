import { Page, Locator } from '@playwright/test';

export class CreatePostPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly summaryInput: Locator;
  readonly contentInput: Locator;
  readonly categorySelect: Locator;
  readonly submitButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('input[id="title"]');
    this.summaryInput = page.locator('input[id="summary"]');
    this.contentInput = page.locator('textarea[id="content"]');
    this.categorySelect = page.locator('select[id="category"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("Publish")');
    this.form = page.locator('form:has-text("Title")');
  }

  async goto() {
    await this.page.goto('/create', { waitUntil: 'load' });
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillSummary(summary: string) {
    await this.summaryInput.fill(summary);
  }

  async fillContent(content: string) {
    await this.contentInput.fill(content);
  }

  async selectCategory(category: string) {
    await this.categorySelect.selectOption({ label: category });
  }

  async submit() {
    await this.submitButton.click();
  }

  async createPost(title: string, summary: string, content: string, category?: string) {
    await this.goto();
    await this.page.pause();
    await this.fillTitle(title);
    await this.fillSummary(summary);
    await this.fillContent(content);
    if (category) {
      await this.selectCategory(category);
    }
    await this.submit();
  }
}
