import pool from './dbconnector';
import log from './logger';

class queries {
    static async getUsers() {
        try {
            const client = await pool.connect();
            const users = await client.query('SELECT * FROM public.users');
            client.release();
            log.info(`Executed query getUsers()`);
            return users;
        } catch (error) {
            log.error(`Error running query getUsers(): ${error}`);
        }
    }

    static async addUser(id: string, email: string, name: string, hashedPassword: string, eligible: string) {
        try {
            let type = eligible ? 'eligible' : 'default';
            let date = new Date();
            const client = await pool.connect();
            console.log(`INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword} ${'2022-11-15 13:14:43'} ${'2022-11-15 13:14:43'} ${type})`)
            await client.query('INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, email, name, hashedPassword, date, date, type]);
            client.release();
            log.info(`Executed query addUser(${email}, ${name}, ${hashedPassword})`);
        } catch (error) {
            log.error(`Error running query addUser(${email}, ${name}, ${hashedPassword}): ${error}`);
        }
    }
}

export default queries;