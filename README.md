# E2E Test Automation - Next.js Blog

Playwright-based end-to-end test automation for a Next.js blog application.

## Tech Stack

- **Playwright** - E2E testing framework
- **TypeScript** - Type-safe test code
- **Page Object Model** - Test design pattern
- **SQL Assertions** - Database-API consistency validation
- **Jenkins** - CI/CD pipeline
- **JMeter** - Performance testing

## Project Structure

```
blog-proj/
├── tests/
│   ├── api/               # API tests
│   │   ├── posts.spec.ts
│   │   ├── comments.spec.ts
│   │   └── db-helper.ts   # SQL assertions helper
│   ├── pages/             # Page Object classes
│   │   ├── HomePage.ts
│   │   ├── CreatePostPage.ts
│   │   ├── SearchPage.ts
│   │   ├── CategoryPage.ts
│   │   ├── CommentPage.ts
│   │   └── PostDetailPage.ts
│   └── blog-complete.spec.ts  # E2E test suite
├── jmeter/                # JMeter performance tests
│   ├── BlogPerformanceTestPlan.jmx
│   └── README.md
├── src/
│   ├── app/              # Next.js app
│   ├── components/       # React components
│   └── lib/              # Database & utilities
├── playwright.config.ts   # Playwright config
└── Jenkinsfile           # CI/CD pipeline
```

## Test Cases Summary

| Type | Count |
|------|-------|
| API Tests (Posts) | 10 |
| API Tests (Comments) | 4 |
| E2E Tests | 26 |
| **Total** | **40** |

### API Tests with SQL Assertions

| Test | Description | SQL Validation |
|------|-------------|----------------|
| GET /api/posts | List posts, filter by category, search | ✅ |
| POST /api/posts | Create post with/without category | ✅ |
| GET /api/posts/:id | Get single post | ✅ |
| DELETE /api/posts/:id | Delete post | ✅ |
| POST /api/comments | Create comment | ✅ |
| DELETE /api/comments | Delete comment | ✅ |

### E2E Tests (TC-001 ~ TC-026)

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

## SQL Assertions

Database-API consistency validation is implemented using direct SQLite queries:

```typescript
import { assertPostInDb, assertCommentInDb } from './db-helper';

// Example: Validate post creation in database
assertPostInDb(post.id, {
  title: 'API Test Post',
  summary: 'API summary',
  content: 'API content',
  categoryId: null,
  viewCount: 0,
});
```

### Assertion Functions

| Function | Description |
|----------|-------------|
| `assertPostInDb(id, data)` | Verify post exists with expected data |
| `assertPostNotInDb(id)` | Verify post is deleted |
| `assertPostCountInDb(count)` | Verify total post count |
| `assertCommentInDb(id, data)` | Verify comment exists |
| `assertCommentNotInDb(id)` | Verify comment is deleted |
| `assertCommentCountForPost(postId, count)` | Verify comment count for post |

## CI/CD Pipeline (Jenkinsfile)

The Jenkins pipeline includes automated stages:

1. **Checkout** - Source code checkout
2. **Install Dependencies** - `npm ci`
3. **Install Playwright Browsers** - Chromium, Firefox, WebKit
4. **Start Dev Server** - Background server startup
5. **Run API Tests** - Execute API test suite
6. **Run E2E Tests** - Execute E2E test suite
7. **Generate Test Report** - Publish HTML report
8. **Stop Dev Server** - Cleanup

### Jenkins Pipeline Features

- Parallel browser testing (Chromium, Firefox, WebKit)
- HTML test report generation
- Automatic cleanup on success/failure
- Email notifications (configurable)

## Performance Testing (JMeter)

JMeter test scenarios validate:

| Metric | Target |
|--------|--------|
| Response Time | < 2000ms |
| Throughput | > 10 req/s |
| Error Rate | < 1% |
| Concurrent Users | 10 users |

### Test Scenarios

| Scenario | Endpoint | Method |
|----------|---------|--------|
| List All Posts | `/api/posts` | GET |
| Get Single Post | `/api/posts/:id` | GET |
| Search Posts | `/api/posts?q=test` | GET |
| Filter by Category | `/api/posts?category=tech` | GET |
| Create Post | `/api/posts` | POST |

### Running JMeter Tests

```bash
cd jmeter
jmeter -n -t BlogPerformanceTestPlan.jmx -l results.jtl -e -o report
open report/index.html
```

## Key Features

- Page Object Model pattern for maintainable test code
- API-based test data management
- **SQL assertions for database-API consistency validation**
- Smart assertions with regex pattern matching
- Dialog handling (accept/dismiss)
- Performance testing with large datasets
- **Jenkins CI/CD pipeline integration**
- **JMeter performance test scenarios**
- Multiple browser support (Chromium, Firefox, Safari)
