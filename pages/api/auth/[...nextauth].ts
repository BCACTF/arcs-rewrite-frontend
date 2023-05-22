import NextAuthBuilder, { AuthOptions } from 'next-auth';

import { NextApiRequest, NextApiResponse } from 'next';

import { Provider } from 'next-auth/providers';
import AppleProvider from 'next-auth/providers/apple';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

import { getOauth } from 'metadata/server';

import { GetTokenParams, JWT, getToken } from 'next-auth/jwt';

export const getSecret = async () => (await getOauth()).nextAuth.secret;
export const getTokenSecret = async (params: GetTokenParams<false>): Promise<JWT | null> => await getToken({
    secret: await getSecret(),
    ...params,
});

const getProvider = async <T>(name: string, providerFn: (options: { clientId: string, clientSecret: string }) => T): Promise<T | undefined> => {
    const provider = (await getOauth()).providers[name];

    if (provider) return providerFn({ clientId: provider.id, clientSecret: provider.secret });
};

const getProviders = async (): Promise<Provider[]> => {
    const [
        apple,
        github,
        google
    ] = await Promise.all([
        getProvider("apple",  AppleProvider),
        getProvider("github", GithubProvider),
        getProvider("google", GoogleProvider),
    ]);

    process.env.NEXTAUTH_URL = (await getOauth()).nextAuth.url;

    const providers = [
        apple  ? [ apple] : [],
        github ? [github] : [],
        google ? [google] : [],
    ].flat(1);

    return providers;
};



let savedOptions: AuthOptions | undefined = undefined;

const getNextAuthOptions = async () => {
    if (savedOptions) return savedOptions;
    const options: AuthOptions = {
        providers: await getProviders(),
        pages: {
            signIn: '/account/signin',
            signOut: '/account/signout',
            error: '/account/error',
            newUser: '/account/new-user',
        },
        callbacks: {
            jwt: params => {
                return {
                    provider: params.account?.provider,
                    ...params.token
                };
            },
        },
        secret: await getSecret(),
    };

    savedOptions = options;

    return options;
};

export default async function NextAuth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`
    return await NextAuthBuilder(req, res, await getNextAuthOptions())
}