// Components


// Hooks


// Types
import { VerificationState as VerStateUser } from "hooks/useUsernameValidation";
import { VerificationState as VerStateTeam } from "hooks/useTeamnameValidation";
import { VerificationState as VerStateJoinTeam } from "hooks/useJoinTeamnameValidation";
import { ComponentProps, FC } from "react";


// Styles


// Utils
import { omitted } from "utils/general";


type VerificationState = VerStateUser | VerStateTeam | VerStateJoinTeam;
interface Props extends Omit<ComponentProps<"input">, "className"> {
    promptName: string;
    verificationState?: VerificationState;
    additionalClassName?: string;
}

const getText = (state: VerificationState): string => {
    switch (state) {
        case "pending": return "Checking name availability...";
        case "success": return "Name is available.";
        case "stalesuccess": return "Previous checked name was available.";
        case "failure": return "Name is already in use or is invalid.";

        case "noexist": return "A team with this name does not exist.";
        case "maxmembers": return "This team already has the maximum number of members.";

        case "error": return "Invalid name format.";
    }
};

const ValidityDisplay: FC<{ state: VerificationState }> = ({ state }) => {
    const base = "absolute top-1/3 right-3 h-1/3 aspect-square rounded-full peer";
    const tooltip = <div className="
        absolute bottom-3/4 right-3 translate-x-1/2
        rounded-md text-sm px-1.5 py-0.5
        bg-signin-background-color
        border border-signin-provider-hover-color/50
        text-signin-text
        opacity-0
        peer-hover:opacity-100 transition-opacity
    ">{getText(state)}</div>;
    switch (state) {
        case "pending": return <>
            <div className={`
                ${base} bg-yellow-500
                after:absolute after:top-0 after:left-0 after:min-w-full after:min-h-full
                after:bg-yellow-500 after:rounded-full after:opacity-70 after:animate-ping 
            `}/>
            {tooltip}
        </>;
        case "success": return <>
            <div className={`${base} bg-green-500`}/>
            {tooltip}
        </>;
        case "stalesuccess": return <>
            <div className={`${base} bg-green-500`}/>
            {tooltip}
        </>;
        case "noexist":
        case "maxmembers":
        case "error":
        case "failure": return <>
            <div className={`${base} bg-red-500`}/>
            {tooltip}
        </>;
    }
};

const TextInput: FC<Props> = (props) => (
    <div className="flex sm:flex-row flex-col items-center w-5/6">
        <span className="
            grow text-signin-text
            mb-2 text-center w-full 
            sm:mb-0 sm:mr-6 sm:text-end sm:w-1/5">{props.promptName}</span>
        <div className="relative w-full sm:w-3/4">
            <input className={`
                h-12 sm:h-14 py-2 w-full
                flex flex-row place-content-around
                border border-signin-provider-outline rounded-lg
                px-5 bg-signin-background-color text-signin-text
                ${props.additionalClassName ?? ""}`}
                {...omitted(props, ["promptName", "verificationState", "additionalClassName"])}/>
            {props.verificationState && <ValidityDisplay state={props.verificationState}/>}
        </div>
    </div>
);

export default TextInput;
