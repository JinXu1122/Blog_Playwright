# Blog System Feature Specification

## 1. Project Overview

- **Project Name**: Next.js Full-Stack Blog System
- **Tech Stack**: Next.js 16 (App Router) + SQLite + Drizzle ORM + Tailwind CSS
- **Project Path**: `blog-proj/`
- **Database**: SQLite (`blog.db`)

---

## 2. Data Model

### 2.1 Posts
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| title | TEXT | Required, post title |
| summary | TEXT | Required, post summary |
| content | TEXT | Required, post body |
| categoryId | INTEGER | Related category, nullable |
| createdAt | TIMESTAMP | Creation time, auto-generated |
| viewCount | INTEGER | View count, default 0 |

### 2.2 Categories
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| name | TEXT | Category name, unique |
| slug | TEXT | URL-friendly identifier, unique |

**Default Categories**: tech, life, thoughts

### 2.3 Comments
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| postId | INTEGER | Related post |
| authorName | TEXT | Commenter name |
| content | TEXT | Comment content |
| createdAt | TIMESTAMP | Creation time |

---

## 3. Feature List

### 3.1 Post Management
- [x] **Post List Page** (`/`)
  - Display all posts
  - Show title, summary, publish date, category, view count
  - Support post deletion
  - Support category filtering
  - Support keyword search

- [x] **Post Detail Page** (`/posts/[id]`)
  - Display full post content
  - Show publish date, view count, category
  - Display comment list
  - Support comment submission
  - Auto-increment view count on visit

- [x] **Create Post Page** (`/create`)
  - Form fields: title, summary, content, category
  - Form validation
  - Redirect to home on success

### 3.2 Category System
- [x] **Category System**
  - Three preset categories: tech, life, thoughts
  - Posts can have one category
  - Support filtering posts by category

### 3.3 Comment System
- [x] **Post Comment**
  - Fill in name and comment content
  - Comments update in real-time
  - Does not trigger view count increase

- [x] **Comment List**
  - Display all comments
  - Show commenter name, content, timestamp

### 3.4 Search Functionality
- [x] **Keyword Search**
  - Search box in top navigation bar on home page
  - Search by post title
  - Search results page shows "Search results: "xxx""
  - Search text auto-clears when switching category filters

---

## 4. API Endpoints

### 4.1 Post Endpoints

| Method | Path | Description | Parameters |
|--------|------|-------------|------------|
| GET | `/api/posts` | Get post list | `?q=keyword`, `?category=slug` |
| POST | `/api/posts` | Create post | `title`, `summary`, `content`, `categoryId` |
| GET | `/api/posts/[id]` | Get post detail | - |
| DELETE | `/api/posts/[id]` | Delete post | - |

### 4.2 Other Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/comments` | Create comment |

---

## 5. Page Routes

| Path | Description | Rendering |
|------|-------------|-----------|
| `/` | Home, post list | Static + client-side filtering |
| `/posts/[id]` | Post detail page | Dynamic rendering |
| `/create` | Create post page | Static rendering |

---

## 6. Component Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (Suspense wrapper)
│   ├── HomeContent.tsx       # Home content (client component)
│   ├── layout.tsx            # Root layout
│   ├── create/page.tsx       # Create post page
│   └── posts/[id]/page.tsx   # Post detail page
├── components/
│   ├── Header.tsx            # Header (with navigation, search, category links)
│   ├── Footer.tsx            # Footer
│   ├── PostCard.tsx          # Post card
│   ├── PostForm.tsx          # Create post form
│   ├── SearchBar.tsx         # Search box
│   ├── CommentSection.tsx    # Comment section
│   ├── CommentForm.tsx       # Comment form
│   └── CommentList.tsx       # Comment list
└── lib/
    ├── schema.ts             # Database schema definition
    ├── db.ts                 # Database connection and initialization
    └── posts.ts              # Database operation functions
```

---

## 7. User Interaction Flows

### 7.1 Reading a Post
1. User clicks post title on home page
2. Navigate to post detail page
3. View count auto-increments by 1
4. User can view category and comments

### 7.2 Posting a Comment
1. User fills in name and comment on post detail page
2. Click "Submit Comment"
3. Comment immediately appears in the list
4. **Does not trigger view count increase**

### 7.3 Searching Posts
1. User enters keyword in search box
2. Click search button or press Enter
3. Navigate to search results page
4. Display posts with matching titles

### 7.4 Filtering Posts
1. User clicks category link (tech/life/thoughts)
2. Display all posts in that category
3. Search box text auto-clears
4. Click "Clear Filter" to return to all posts

### 7.5 Writing a Post
1. User clicks "Write" button in header
2. Navigate to create post page `/create`
3. Fill in title, summary, content
4. (Optional) Select a category
5. Click "Publish Post"
6. Navigate to home page, new post appears at top of list
