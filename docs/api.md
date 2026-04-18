# API Reference

Base URL: `/api/v1`

## Public Endpoints

### `GET /books`

List books with pagination, search, and filters.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Search in title and author |
| `genre` | string | Exact genre match |
| `available` | boolean | Only show books with copies available |

**Response:**
```json
{
  "data": [{ "id": "uuid", "title": "...", "author": "...", "availableCopies": 2, ... }],
  "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

### `GET /books/:id`

Get book details. Returns `404` if not found or soft-deleted.

### `GET /health`

Liveness check. Returns `200 OK`.

### `GET /health/ready`

Readiness check (DB + Redis). Returns `200` when both are healthy.

---

## Authenticated Endpoints (requires Bearer JWT)

### `POST /borrowings`

Borrow a book.

**Body:** `{ "bookId": "uuid" }`

**Responses:**
- `201` — borrowing created
- `401` — missing/invalid token
- `404` — book not found
- `409` — no copies available, or already borrowed by this user

### `POST /borrowings/:id/return`

Return a borrowed book.

**Responses:**
- `200` — returned successfully
- `403` — not your borrowing (non-admin)
- `409` — already returned

### `GET /borrowings/my`

List current user's borrowings.

**Query parameters:** `status` (active | returned | overdue), `page`

---

## Admin Endpoints (requires `admin` role)

### `POST /admin/books`

Create a new book.

**Body:** `{ "title", "author", "isbn"?, "genre"?, "totalCopies", "description"?, "publisher"?, "publishedYear"?, "coverImageUrl"? }`

### `PUT /admin/books/:id`

Update a book.

### `DELETE /admin/books/:id`

Soft-delete a book (`isActive = false`).

### `PATCH /admin/books/:id/copies`

Update total copies.

**Body:** `{ "totalCopies": 5 }`

### `GET /admin/books/search-ol`

Search Open Library.

**Query:** `?q=tolkien`

**Response:** Array of `{ olWorkId, title, author, isbn, publishedYear, coverUrl }`

### `POST /admin/books/import`

Import an Open Library result as a new book. Body: OL search result object.

### `GET /admin/borrowings`

List all borrowings. Query params: `status`, `page`.
