// Components
import AccountDropdown from "./AccountDropdown";

// Hooks


// Types
import { AccountState } from "account/types";
import { FC } from "react"
import { CompetitionMetadata } from "metadata/general";

// Styles
import rawStyles from './HeaderBanner.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import SignInButton from "./SignInButton";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils




interface HeaderBannerProps {
    account: AccountState;
    meta: CompetitionMetadata;
}


const HeaderBanner: FC<HeaderBannerProps> = ({ account, meta }) => {
    return <div className={styles.headerContainer} >

        <div className={styles.spacer}/>

        {account.loggedIn
            ? <AccountDropdown info={account.info} />
            : <SignInButton/>
        }
    </div>
};

export default HeaderBanner;
