import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
} catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    console.log('Ensure MySQL is running and credentials in .env are correct.');
}

export default pool;
