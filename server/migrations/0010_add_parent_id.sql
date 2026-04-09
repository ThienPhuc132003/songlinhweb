ALTER TABLE product_categories ADD COLUMN parent_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL;
