import NoSsr from '../NoSsr/NoSsr';

import { FC } from "react";

import styles from './FloatingEasterEgg.module.scss';

interface FloatingEasterEggProps {
    children: JSX.Element | JSX.Element[];
}

const FloatingEasterEgg: FC<FloatingEasterEggProps> = ({ children }) => {
    return (
        <NoSsr>
            <div className={styles.wrapper}>
                {children}
            </div>
        </NoSsr>
    );
}

export default FloatingEasterEgg;