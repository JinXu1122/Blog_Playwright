import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;
  readonly allCategory: Locator;
  readonly techCategory: Locator;
  readonly lifeCategory: Locator;
  readonly thoughtsCategory: Locator;
  readonly clearFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allCategory = page.getByRole('navigation').getByRole('link', { name: 'All' });
    this.techCategory = page.getByRole('navigation').getByRole('link', { name: 'Tech' });
    this.lifeCategory = page.getByRole('navigation').getByRole('link', { name: 'Life' });
    this.thoughtsCategory = page.getByRole('navigation').getByRole('link', { name: 'Thoughts' });
    this.clearFilterButton = page.locator('text=Clear Filter');
  }

  async goto() {
    await this.page.goto('/');
  }

  async selectCategory(category: 'All' | 'Tech' | 'Life' | 'Thoughts') {
    switch (category) {
      case 'All':
        await this.allCategory.click();
        break;
      case 'Tech':
        await this.techCategory.click();
        break;
      case 'Life':
        await this.lifeCategory.click();
        break;
      case 'Thoughts':
        await this.thoughtsCategory.click();
        break;
    }
  }

  async clickClearFilter() {
    await this.clearFilterButton.click();
  }
}
