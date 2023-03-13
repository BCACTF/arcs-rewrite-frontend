// Components
import AccountDropdown from "./AccountDropdown";

// Hooks


// Types
import { MyUser, UserState } from "account/types";
import { FC } from "react"
import { CompetitionMetadata } from "metadata/general";

// Styles
import rawStyles from './HeaderBanner.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import SignInButton from "./SignInButton";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils




interface HeaderBannerProps {
    account: MyUser | null;
    meta: CompetitionMetadata;
}


const HeaderBanner: FC<HeaderBannerProps> = ({ account, meta }) => {
    console.log("HeaderBanner", account);

;    return (
        <div className={styles.headerContainer} >
            <div className={styles.spacer}/>
            {account
                ? <AccountDropdown info={account} />
                : <SignInButton/>
            }
        </div>
    );
};

export default HeaderBanner;
