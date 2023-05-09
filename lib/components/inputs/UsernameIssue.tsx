// Components


// Hooks


// Types
import { FC } from "react";
import { UsernameIssue } from "utils/username";


// Styles


// Utils
import { MONO_SEPERATOR, getIssueText } from "utils/username";


interface Props {
    issue: UsernameIssue | null;
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
