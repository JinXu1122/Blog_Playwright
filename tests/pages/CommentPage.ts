import { Page, Locator } from '@playwright/test';

export class CommentPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly commentInput: Locator;
  readonly postCommentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[placeholder*="name"]');
    this.commentInput = page.locator('textarea[placeholder*="comment"]');
    this.postCommentButton = page.locator('button:has-text("Post Comment")');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillComment(comment: string) {
    await this.commentInput.fill(comment);
  }

  async postComment() {
    await this.postCommentButton.click();
  }

  async addComment(name: string, comment: string) {
    await this.fillName(name);
    await this.fillComment(comment);
    await this.postComment();
  }

  async isCommentVisible(comment: string): Promise<boolean> {
    return await this.page.locator(`text=${comment}`).isVisible();
  }
}
