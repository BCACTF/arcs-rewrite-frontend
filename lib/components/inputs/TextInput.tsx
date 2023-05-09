// Components


// Hooks


// Types
import { VerificationState } from "hooks/useDuplicateCheck";
import { ComponentProps, FC } from "react";


// Styles


// Utils
import { omitted } from "utils/general";


interface Props extends Omit<ComponentProps<"input">, "className"> {
    promptName: string;
    verificationState?: VerificationState;
    additionalClassName?: string;
}

const color = (state: VerificationState) => {
    switch (state) {
        case "pending": return `
            bg-yellow-500
            after:absolute after:top-0 after:left-0 after:min-w-full after:min-h-full
            after:bg-yellow-500 after:rounded-full after:opacity-70 after:animate-ping 
        `;
        case "success": return "bg-green-500";
        case "failure": return "bg-red-500";
    }
} 

const TextInput: FC<Props> = (props) => (
    <div className="flex flex-row items-center w-5/6">
        <span className="grow text-end mr-6">{props.promptName}</span>
        <div className="relative w-3/4">
            <input className={`
                h-12 md:h-14 py-2 w-full
                flex flex-row place-content-around
                border border-signin-provider-outline rounded-lg
                px-5
                ${props.additionalClassName ?? ""}`}
                {...omitted(props, ["promptName", "verificationState", "additionalClassName"])}/>
            {props.verificationState && <div className={`absolute top-1/3 right-3 h-1/3 aspect-square rounded-full ${color(props.verificationState)}`}/>}
        </div>
    </div>
);

export default TextInput;
