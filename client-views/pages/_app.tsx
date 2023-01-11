import { SessionProvider } from "next-auth/react";

import type { AppProps } from 'next/app';
import { FC, useEffect } from "react";

import '../styles/globals.css';

import WebFont from 'webfontloader';

const App: FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
};

export default App;