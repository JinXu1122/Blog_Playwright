# E2E Test Automation - Next.js Blog

Playwright-based end-to-end test automation for a Next.js blog application.

## Tech Stack

- **Playwright** - E2E testing framework
- **TypeScript** - Type-safe test code
- **Page Object Model** - Test design pattern

## Project Structure

```
blog-proj/
├── tests/
│   ├── pages/              # Page Object classes
│   │   ├── HomePage.ts
│   │   ├── CreatePostPage.ts
│   │   ├── SearchPage.ts
│   │   ├── CategoryPage.ts
│   │   ├── CommentPage.ts
│   │   └── PostDetailPage.ts
│   └── blog-complete.spec.ts  # Test suite
├── src/
│   ├── app/               # Next.js app
│   ├── components/        # React components
│   └── lib/               # Database & utilities
└── playwright.config.ts   # Playwright config
```

## Test Cases

| ID | Description |
|----|-------------|
| TC-001 | Empty blog state |
| TC-002a/002b | Navigation to create post |
| TC-003 | Create post with valid inputs |
| TC-004 | Create post with category |
| TC-005 | View post detail |
| TC-006 | Category navigation visible |
| TC-007/008 | View count behavior |
| TC-009/010 | Comment functionality |
| TC-011 | Comment does not affect view count |
| TC-012/012b/012c | Search functionality |
| TC-013 | Search with no results |
| TC-014/015 | Category filtering |
| TC-016 | Search cleared when switching category |
| TC-017/017b | Delete post (accept/cancel) |
| TC-018 | Access non-existent post |
| TC-019~TC-026 | Performance tests |

## Run Tests

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific project
npx playwright test --project=chromium
```

## Test Data

- Database cleanup via `POST /api/test/cleanup`
- Test data seeding via `POST /api/posts`
- Each test seeds its own data for isolation

## Key Features

- Page Object Model pattern for maintainable test code
- API-based test data management
- Smart assertions with regex pattern matching
- Dialog handling (accept/dismiss)
- Performance testing with large datasets
- Multiple browser support (Chromium, Firefox, Safari)
