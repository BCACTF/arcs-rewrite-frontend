// Types
import { GetTokenParams } from "next-auth/jwt";
import { CachedUser } from "cache/users";

// Utils
import { getTokenSecret } from "api/auth/[...nextauth]";
import { getAllUsers } from "cache/users";


export type Account = CachedUser & { img: string | null };

const getAccount = async ({ req }: GetTokenParams): Promise<Account | null> => {
    const token = await getTokenSecret({ req });

    if (!token || !token.email) return null;

    const email = token.email;
    if (!email) return null;

    const users = await getAllUsers();
    const user = users.find(user => user.email === email);

    return user ? { ...user, img: token.picture ?? null } : null;
};


export default getAccount;