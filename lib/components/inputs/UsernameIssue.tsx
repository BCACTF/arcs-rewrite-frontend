// Components


// Hooks


// Types
import { VerificationState } from "hooks/useDuplicateCheck";
import { ComponentProps, FC } from "react";


// Styles


// Utils
import { omitted } from "utils/general";
import { MONO_SEPERATOR, UsernameIssue, getIssueText } from "utils/username";


interface Props {
    issue: UsernameIssue | null;
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

const UsernameIssue: FC<Props> = (props) => {
    if (!props.issue) return <></>;

    const rawParts = getIssueText(props.issue).split(MONO_SEPERATOR);
    const parts = rawParts.length % 2 === 1 ? rawParts : [getIssueText(props.issue)];
    
    console.log(props.issue);

    return <div className="font-bold text-sm text-red-500 px-6 whitespace-break-spaces leading-6">
        {parts.map(
            (part, idx) => idx % 2 === 0
                ? <pre key={idx} className="font-sans inline whitespace-pre-wrap">{part}</pre>
                : <span className="font-mono bg-slate-600 bg-opacity-50 px-1 rounded-md/sm inline-block leading-normal" key={idx}>{part}</span>
        )}
    </div>;
};

export default UsernameIssue;
