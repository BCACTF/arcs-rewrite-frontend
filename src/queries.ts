import pool from './dbconnector';
import log from './logger';

class queries {
    static async getUsers() {
        try {
            log.debug(`Attemping to run query "SELECT * FROM public.users"`);
            const client = await pool.connect();
            const users = await client.query('SELECT * FROM public.users');
            client.release();
            log.info(`Ran query "SELECT * FROM public.users"`);
            return users;
        } catch (error) {
            log.error(`Error running query "SELECT * FROM public.users": ${error}`);
        }
    }

    static async checkIfExistingNameorEmail(email: string, name: string) {
        try {
            log.debug(`Attemping to run query "SELECT COUNT(*) FROM public.users WHERE email='${email}' OR name='${name}'"`);
            const client = await pool.connect();
            const matchCount = await client.query(`SELECT COUNT(*) FROM public.users WHERE email='${email}' OR name='${name}'`);
            client.release();
            log.info(`Ran query "SELECT COUNT(*) FROM public.users WHERE email='${email}' OR name='${name}'"`);
            return Boolean(parseInt(matchCount.rows[0].count));
        } catch (error) {
            log.error(`Error running query "SELECT COUNT(*) FROM public.users WHERE email='${email}' OR name='${name}'": ${error}`);
        }
    }

    static async addUser(id: string, email: string, name: string, hashedPassword: string, eligible: string) {
        let type = eligible ? 'eligible' : 'default';
        let date = new Date().toISOString();
        try {
            console.log(email, name)
            log.debug(`Attemping to run query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})"`)
            const client = await pool.connect();
            await client.query('INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, email, name, hashedPassword, date, date, type]);
            client.release();
            log.info(`Ran query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})"`);
        } catch (error) {
            log.error(`Error running query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})": ${error}`);
        }
    }
}

export default queries;