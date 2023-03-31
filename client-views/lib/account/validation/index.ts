// Components


// Hooks


// Types
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { CachedUser, getAllUsers } from "cache/users";


// Styles


// Utils

export type Account = CachedUser & { img: string | null };

const getAccount = async ({ req }: GetServerSidePropsContext): Promise<Account | null> => {
    const token = await getToken({ req });

    if (!token || !token.email) return null;

    const email = token.email;
    if (!email) return null;

    const users = await getAllUsers();
    const user = users.find(user => user.email === email);

    return user ? { ...user, img: token.picture ?? null } : null;
};


export default getAccount;