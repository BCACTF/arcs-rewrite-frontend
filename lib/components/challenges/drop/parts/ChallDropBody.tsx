// Components
import ReactMarkdown from "react-markdown";

// Hooks
import { useState } from "react"

// Types
import React, { CSSProperties, FC } from "react"
import { ChallDropProps } from "./ChallDrop";
import ChallDropFlagInput from "./ChallDropFlagInput";

// Utils
import remarkGfm from "remark-gfm";


const ListItem = ({ item, className, style }: { item: string, style?: CSSProperties, className?: string }) => (
    <span className={className} style={style}>{item}</span>
)

const EnglishList = ({ items: list, style, className }: { items: string[], style?: CSSProperties, className?: string }) => {
    if (list.length === 0) return <></>;
    else if (list.length === 1) return <code className={className} key={0}>{list[0]}</code>;
    else if (list.length === 2) return <><ListItem {...{style, className, item: list[0]}} key={0}/> and <ListItem {...{style, className, item: list[1]}} key={1}/></>;
    else return <>
        {list.slice(0, -1).map(
            (val, idx) => <React.Fragment key={idx}>
                <ListItem {...{style, className, item: val}}/>
                {", "}
            </React.Fragment>
        )}
        <React.Fragment key={list.length - 1}>
            {"and "}
            <ListItem {...{style, className, item: list[list.length - 1]}}/>
        </React.Fragment>
    </>;
}

const Hint = ({ value }: { value: string }) => {
    const [revealed, setRevealed] = useState(false);
    return <div
        className={`
            block transition-all py-1 px-2 rounded-lg mb-2 select-none 
            ${revealed ? "text-white bg-slate-800 cursor-default" : "text-transparent bg-slate-900 cursor-pointer"}`}
        onClick={() => setRevealed(true)}>
        {value}
    </div>;
};

const BodyMeta: FC<Pick<
    ChallDropProps["metadata"],
    "solveCount" | "categories" | "points" | "tags" | "authors" | "hints"
>> = ({ solveCount, categories, points, authors, hints }) => (
    <div className="w-full p-5 pt-2 pl-0 ml-auto flex flex-col"
        style={{ gridArea: "meta" }}>
        <div className="py-3">
            <h4 className="font-medium text-base">Categories:</h4>
            {categories.join(", ")}
        </div>
        <span className="py-1.5">{points} points</span>
        <span className="py-1.5">
            {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} {solveCount === 1 ? "solve" : "solves"}
        </span>
        <div className="py-3">
            <h4 className="font-medium text-base mb-1">Hints:</h4>
            {hints.map(hint => <Hint value={hint} />)}
        </div>
        <div className="py-1.5 mb-auto">
            By <EnglishList className="font-mono text-chall-author-name-color" items={authors}/>
        </div>
    </div>
);


type LinkType = "nc" | "web" | "admin" | "static";

const getFileName = (url: string): string => url.split("/").slice(-1)[0];
const getText = (type: LinkType): string => {
    switch (type) {
        case "nc": return "Netcat servers"
        case "web": return "Web servers"
        case "admin": return "Admin bots"
        case "static": return "Static resources"
    }
};
const Links: FC<{ urls: string[], type: LinkType }> = ({ urls, type }) => {
    if (urls.length === 0) return <></>;
    switch (type) {
        case "web":
        case "admin":
        case "static":
            return <div>
                <span className="text-lg block">{getText(type)}:</span>
                <div
                    className="w-max flex flex-col">
                    {urls.map(url => <a
                        target="_blank" rel="noreferrer"
                        className="text-blue-300 underline"
                        href={url} key={url}>
                        {getFileName(url)}
                    </a>)}
                </div>
            </div>;
        case "nc":
            return <div>
                <span className="text-lg mb-1.5 block">Netcat Links:</span>
                <code
                    className="
                        border-chall-nc-border-color border-2 bg-chall-nc-background-color rounded-lg
                        text-chall-nc-text-color
                        w-max px-3
                        flex flex-col text-sm">{
                    urls.map(url => <span key={url} className="my-1">nc {getFileName(url)}</span>)
                }</code>
            </div>;

    }
};

const ChallDropBody: FC<ChallDropProps & { open: boolean }> = ({
    metadata: { solveCount, categories, points, tags, desc, links, authors, hints },
    solved,
    submission: { challId, userId, teamId }
}) => (
    <div
        className="
            border-chall-border-color border border-t-0
            bg-chall-background-color text-chall-text-color
            min-h-max max-w-full
            grid"
        style={{
            gridTemplateAreas: "'cntn meta' 'flag flag'",
            gridTemplateColumns: "3fr 1fr",
        }}>
        <div className="m-5 mt-5" style={{ gridArea: "cntn" }}>
            <ReactMarkdown
                components={components}
                remarkPlugins={[remarkGfm]}>
                {desc}
            </ReactMarkdown>
		{
		Object.values(links).some(x => x.length > 0) ?
		(
			<div className="
				border-t-1 border-white border-opacity-20 border-t
				pt-3 mt-3 w-full
				flex flex-col gap-2">
				<h4 className="text-xl font-bold">Resources:</h4>

				<Links urls={links.nc} type={"nc"} key={"nc"}/>
				<Links urls={links.web} type={"web"} key={"web"}/>
				<Links urls={links.admin} type={"admin"} key={"admin"}/>
				<Links urls={links.static} type={"static"} key={"static"}/>
			</div>
		) : null
		}            

        </div>

        <BodyMeta {...{ solveCount, solved, points, tags, categories, links, authors, hints }}/>

        <ChallDropFlagInput {...{ challId, teamId, userId }} />

    </div>
);


type ReactMarkdownComponentStyles = Parameters<typeof ReactMarkdown>[0]["components"];

const components: ReactMarkdownComponentStyles = {

    a: ({ className, children, ...props}) => (
        <a {...props} className={`${className} text-blue-300 underline`}>{children}</a>
    ),
    link: ({ className, children, ...props}) => (
        <link {...props} className={`${className} text-blue-300 underline`}>{children}</link>
    ),
    h1: ({ className, children, ...props}) => <h1 {...props} className={`${className} text-3xl font-bold`}>{children}</h1>,
    h2: ({ className, children, ...props}) => <h2 {...props} className={`${className} text-2xl font-semibold`}>{children}</h2>,
    h3: ({ className, children, ...props}) => <h3 {...props} className={`${className} text-xl font-semibold`}>{children}</h3>,
    h4: ({ className, children, ...props}) => <h4 {...props} className={`${className} text-lg`}>{children}</h4>,
    h5: ({ className, children, ...props}) => <h5 {...props} className={`${className} text-lg`}>{children}</h5>,
    h6: ({ className, children, ...props}) => <h6 {...props} className={`${className} text-base`}>{children}</h6>,

    p: ({ className, children, ...props}) => (
        <p {...props} className={`${className} mb-3`}>{children}</p>
    ),

    ol: ({ className, children, ...props}) => (
        <ol {...props} className={`${className} text-base font-normal list-decimal pl-8 my-3`}>{children}</ol>
    ),
    hr: ({ className, children, ...props}) => (
        <hr {...props} className={`${className} my-3`}>{children}</hr>
    ),


    section: ({ className, children, ...props}) => (
        <section {...props} className={`${className} mt-5 text-xl font-semibold`}>{children}</section>
    )
};


export default ChallDropBody;
