// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';


// Hooks


// Types
import { FC, useState } from "react"
import { AccountInfo } from "account/types";


// Styles
import rawStyles from './AccountDropdown.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { TeamAffiliationState } from "account/types/team";
import Link from 'next/link';
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils



interface DropdownEntryProps {
    href: string;
    entryText: string;
    open: boolean;
}
export const DropdownEntry: FC<DropdownEntryProps> = ({ href, entryText, open }) => (
    <Link href={href} className={builder.dropdownEntry.IF(open).open()}>
        <span className={styles.entryNameSpan}>{entryText}</span>
        <FontAwesomeIcon className={styles.entryLinkIcon} icon={faArrowUpRightFromSquare}/>
    </Link>
);

interface AccountDropdownProps {
    info: AccountInfo;
}

const teamItemText: Record<TeamAffiliationState, string> = {
    [TeamAffiliationState.NONE]: "Join a team",
    [TeamAffiliationState.REQUESTED]: "Team Status",
    [TeamAffiliationState.ACCEPTED]: "View Team",
};


const AccountDropdown: FC<AccountDropdownProps> = ({ info: { holderName, teamAffiliationState, id: userId, isAdminClientSide } }) => {
    const [open, setDropdownOpen] = useState(false);

    return <div className={builder.flexContainer.IF(open).open()} onClick={() => setDropdownOpen(b => !b)}>
        <span className={styles.accountNameSpan}>{holderName}</span>
        <div className={builder.chevron.IF(open).open()}/>
        <div className={builder.dropdownContainer.IF(open).open()}>
            {
                isAdminClientSide
                    ? <DropdownEntry href={"/admin"} entryText={"Admin Panel"} open={open}/>
                    : <DropdownEntry href={"/team"} entryText={teamItemText[teamAffiliationState]} open={open}/>
            }
            <DropdownEntry href={"/challs?include=bookmark"} entryText={"Bookmarks"} open={open}/>
            <DropdownEntry href={`/stats/user/${userId}`} entryText={"User Stats"} open={open}/>
            <DropdownEntry href={"/account/settings"} entryText={"Settings"} open={open}/>
            <DropdownEntry href={"/signout"} entryText={"Sign Out"} open={open}/>
        </div>
    </div>
};

export default AccountDropdown;
