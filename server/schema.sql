CREATE DATABASE IF NOT EXISTS deeevyashakthi;
USE deeevyashakthi;

-- Customers table for authentication
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT,
    delivery_address TEXT,
    product ENUM('DIVPAK', 'DIVLITE', 'DIVGLO') NOT NULL,
    gsm INT NOT NULL,
    size_a DECIMAL(10,2),
    size_b DECIMAL(10,2),
    packing_type ENUM('Bundle', 'Reel') NOT NULL,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    po_date DATE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    po_document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Sales Orders table
CREATE TABLE IF NOT EXISTS sales_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_number VARCHAR(100) NOT NULL UNIQUE,
    po_number VARCHAR(100),
    product ENUM('DIVPAK', 'DIVLITE', 'DIVGLO') NOT NULL,
    gsm INT NOT NULL,
    size_a DECIMAL(10,2),
    size_b DECIMAL(10,2),
    packing_type ENUM('Bundle', 'Reel') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    so_status ENUM('Draft', 'Verified', 'Documents Sent', 'Invoiced', 'Cancelled') DEFAULT 'Draft',
    verification_status ENUM('Pending', 'Matched', 'Mismatched') DEFAULT 'Pending',
    verification_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_number) REFERENCES purchase_orders(po_number)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    so_id INT,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_status ENUM('Unpaid', 'Partially Paid', 'Paid') DEFAULT 'Unpaid',
    payment_remarks TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (so_id) REFERENCES sales_orders(id)
);

-- Customer Queries table
CREATE TABLE IF NOT EXISTS queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    query_status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Initial Data for Testing
INSERT INTO customers (name, email) VALUES ('Test Customer', 'customer@example.com') ON DUPLICATE KEY UPDATE email=email;
INSERT INTO customers (name, email) VALUES ('Internal Admin', 'admin@deeevyashakti.com') ON DUPLICATE KEY UPDATE email=email;
