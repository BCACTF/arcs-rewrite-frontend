import pool from './db_connector';
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

    static async checkIfExistingUser(name: string, email?: string,) {
        if (typeof (email) === 'undefined') {
            try {
                log.debug(`Attemping to run query "SELECT * FROM public.users WHERE name='${name}'"`);
                const client = await pool.connect();
                const user = await client.query(`SELECT * FROM public.users WHERE name='${name}'`);
                client.release();
                log.info(`Ran query "SELECT * FROM public.users WHERE name='${name}'"`);
                return user;
            } catch (error) {
                log.error(`Error running query "SELECT * FROM public.users WHERE name='${name}'": ${error}`);
            }
        }
        else {
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
    }

    static async addUser(id: string, email: string, name: string, hashedPassword: string, eligible: string) {
        let type = eligible ? 'eligible' : 'default';
        let date = new Date().toISOString();
        try {
            log.debug(`Attemping to run query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})"`)
            const client = await pool.connect();
            await client.query('INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, email, name, hashedPassword, date, date, type]);
            client.release();
            log.info(`Ran query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})"`);
        } catch (error) {
            log.error(`Error running query "INSERT INTO public.users (id, email, name, hashed_password, inserted_at, updated_at, type) VALUES (${id}, ${email}, ${name}, ${hashedPassword}, ${date}, ${date}, ${type})": ${error}`);
        }
    }

    static async createTeam(id: string, name: string, hashedPassword: string, affliation: string, userId: string) {
        let date = new Date().toISOString();
        try {
            log.debug(`Attemping to run query "INSERT INTO public.teams (id, name, hashed_password, inserted_at, updated_at, affiliation) VALUES (${id}, ${name}, ${hashedPassword}, ${date}, ${date}, ${affliation})"`);
            const client = await pool.connect();
            await client.query('INSERT INTO public.teams (id, name, hashed_password, inserted_at, updated_at, affiliation) VALUES ($1, $2, $3, $4, $5, $6)', [id, name, hashedPassword, date, date, affliation]);
            client.release();
            log.info(`Ran query "INSERT INTO public.teams (id, name, hashed_password, inserted_at, updated_at, affiliation) VALUES (${id}, ${name}, ${hashedPassword}, ${date}, ${date}, ${affliation})"`);
        } catch (error) {
            log.error(`Error running query "INSERT INTO public.teams (id, name, hashed_password, inserted_at, updated_at, affiliation) VALUES (${id}, ${name}, ${hashedPassword}, ${date}, ${date}, ${affliation})": ${error}`);
        }
    }

    static async checkIfExistingTeam(name: string) {
        try {
            log.debug(`Attemping to run query "SELECT * FROM public.teams WHERE name='${name}'"`);
            const client = await pool.connect();
            const team = await client.query(`SELECT * FROM public.teams WHERE name='${name}'`);
            client.release();
            log.info(`Ran query "SELECT * FROM public.teams WHERE name='${name}'"`);
            return team;
        } catch (error) {
            log.error(`Error running query "SELECT * FROM public.teams WHERE name='${name}'": ${error}`);
        }
    }

    static async joinTeam(teamName: string, userId: string) {

    }
}

async function updateTeamEligibility(teamId: string) {
    // if all members are eligible, set team to eligible, otherwsie set to false
    try {
        
    } catch (error) {
    }
}
export default queries;