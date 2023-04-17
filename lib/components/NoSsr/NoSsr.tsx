import dynamic from 'next/dynamic';
import React from 'react';

const NoSsrFragment = (props: {children: JSX.Element | JSX.Element[]}) => (
    <React.Fragment>{props.children}</React.Fragment>
);

const NoSsr = dynamic(() => Promise.resolve(NoSsrFragment), {
    ssr: false,
});

export default NoSsr;
