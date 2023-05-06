import NextAuth, { AuthOptions } from 'next-auth';
import AppleProvider from 'next-auth/providers/apple';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { Provider } from 'next-auth/providers';
// import { checkUserOauth } from 'database/users';

const getProvider = <T>(prefix: string, providerFn: (options: { clientId: string, clientSecret: string }) => T): T | undefined => {
    const { id, secret } = { id: process.env[`${prefix}_ID`], secret: process.env[`${prefix}_SECRET`] };

    if (id && secret) return providerFn({ clientId: id, clientSecret: secret });
}

export let activeProviders: string[] = [];

const getProviders = (): Provider[] => {
    const [
        apple,
        github,
        google
    ] = [
        getProvider("APPLE",  AppleProvider),
        getProvider("GITHUB", GithubProvider),
        getProvider("GOOGLE", GoogleProvider),
    ];

    const providers = [
        apple  ? [ apple] : [],
        github ? [github] : [],
        google ? [google] : [],
    ].flat(1);

    activeProviders = providers.map(provider => provider.id);

    return providers;
};

export const authOptions: AuthOptions = {
    providers: getProviders(),
    pages: {
        signIn: '/account/signin',
        signOut: '/account/signout',
        error: '/account/error',
        newUser: '/account/new-user',
    },
    callbacks: {
        jwt: params => params.token,
        // signIn: async ({ account, email, profile, user }) => {
        //     if (!account) return false;
        //     if (!checkUserOauth({ id: ,  }))
        //     return true;
        // },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
