# Friends Pizza Hut - Database Schema (PostgreSQL)

## Tables

- users (id, name, email, phone, password, role, address, profile_pic)
- products (id, name, description, category_id, price, discount, variants, images, stock, tags)
- categories (id, name, image, status, order)
- orders (id, user_id, products_list, total_price, delivery_fee, tax, status, city, created_at)
- order_status_history (order_id, status, timestamp)
- reviews (id, user_id, product_id, rating, comment, approved)
- riders (id, name, email, phone, password, assigned_orders, earnings)
- sliders (id, image, title, subtitle, CTA_link, active, schedule)
- banners (id, image, link, size, active, schedule)
- notifications (id, user_id, type, message, read_status, timestamp)
- cities (id, name, delivery_fee)
- payments (id, order_id, method, status, transaction_id)

## Relationships

- products → categories (many-to-one)
- orders → users (many-to-one)
- orders → products (many-to-many)
- reviews → products & users (many-to-one)
- orders → riders (optional, many-to-one)

---

## ER Diagram

[Add ER diagram here]

---

## Notes
- Use UUIDs for primary keys
- Use JSONB for variants, images, products_list fields
- Add indexes for performance
- Use foreign keys for relationships
