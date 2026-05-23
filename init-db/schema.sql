-- schema.sql
CREATE TABLE IF NOT EXISTS queue_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_id VARCHAR(100) NOT NULL,
    is_processed BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);