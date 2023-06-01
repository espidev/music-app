import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    connectionLimit: 5
});

export function getDB() {
    return pool.getConnection();
}