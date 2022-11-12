import pool from './dbconnector';
import log from './logger';
class queries {
    static async getUsers() {
        try {
            const client = await pool.connect();
            const users = await client.query('SELECT * FROM users');
            client.release();
            log.info(`Executed query getUsers()`);
            return users;
        } catch (error) {
            log.error(`Error running query getUsers(): ${error}`);
        }
    }

    static async addUser(username: string, email: string, password: string) {
        try {
            const client = await pool.connect();
            await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
            client.release();
            log.info(`Executed query addUser(${username}, ${email}, ${password})`);
        } catch (error) {
            log.error(`Error running query addUser(${username}, ${email}, ${password}): ${error}`);
        }
    }
}


export default queries;