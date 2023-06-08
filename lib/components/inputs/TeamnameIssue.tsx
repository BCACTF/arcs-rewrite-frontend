// Components


// Hooks


// Types
import { FC } from "react";
import { TeamnameIssue } from "utils/teamname";


// Styles


// Utils
import { MONO_SEPERATOR, getIssueText } from "utils/teamname";


interface Props {
    issue: TeamnameIssue | null;
}

const TeamnameIssue: FC<Props> = (props) => {
    if (!props.issue) return <></>;

    const rawParts = getIssueText(props.issue).split(MONO_SEPERATOR);
    const parts = rawParts.length % 2 === 1 ? rawParts : [getIssueText(props.issue)];
    
    return <div className="font-bold text-sm text-red-500 px-6 whitespace-break-spaces leading-6">
        {parts.map(
            (part, idx) => idx % 2 === 0
                ? <pre key={idx} className="font-sans inline whitespace-pre-wrap">{part}</pre>
                : <span className="font-mono bg-slate-600 bg-opacity-50 px-1 rounded-md/sm inline-block leading-normal" key={idx}>{part}</span>
        )}
    </div>;
};

export default TeamnameIssue;
