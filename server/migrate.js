import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const initDb = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server.');

        const schema = fs.readFileSync('./schema.sql', 'utf8');
        const commands = schema.split(';').filter(cmd => cmd.trim() !== '');

        for (const command of commands) {
            await connection.query(command);
        }

        console.log('Database and tables created successfully.');
        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error.message);
    }
};

initDb();
