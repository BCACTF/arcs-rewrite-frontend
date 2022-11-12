import pool from './dbconnector';
class queries {
    static async getUsers() {
        try {
            const client = await pool.connect();
            const users = await client.query('SELECT * FROM users');
            client.release();
            return users;
        } catch (error) {
            console.log(error);
        }
    }

    static async addUser(username: string, email: string, password: string) {
        try {
            const client = await pool.connect();
            await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
            client.release();
        } catch (error) {
            console.log(error);
        }
    }
}


export default queries;