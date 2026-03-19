# Process Pipe static site + MySQL search

## 1) Import the catalogue database
Import `process_pipe_catalog_mysql.sql` into your MySQL server (Workbench: Server → Data Import).

## 2) Copy this folder to your hosting
This site expects PHP enabled (most cPanel hosts).

## 3) Configure DB credentials
Edit:
- `api/config.php`

Set host/user/password/database.

## 4) Use the search page
Open:
- `/pages/search.html`

It calls:
- `/api/search.php?q=...`
- `/api/product.php?id=...`

## Notes
- Search uses FULLTEXT when available and falls back to LIKE.
- You can add prices/stock later by extending the products table.
