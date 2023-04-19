// Components
import ReactMarkdown from "react-markdown";

// Hooks


// Types

import React, { CSSProperties, FC } from "react"


// Styles
import { ChallDropProps } from "./ChallDrop";


// Utils
import remarkGfm from "remark-gfm";
import ChallDropFlagInput from "./ChallDropFlagInput";


const ListItem = ({ item, className, style }: { item: string, style?: CSSProperties, className?: string }) => (
    <span className={className} style={style}>{item}</span>
)
const EnglishList = ({ items: list, style, className }: { items: string[], style?: CSSProperties, className?: string }) => {
    if (list.length === 0) return <></>;
    else if (list.length === 1) return <code className={className}>list[0]</code>;
    else if (list.length === 2) return <><ListItem {...{style, className, item: list[0]}}/> and <ListItem {...{style, className, item: list[1]}}/></>;
    else return <>
        {list.slice(0, -1).map(
            (val, idx) => <>
                <ListItem {...{style, className, item: val}} key={idx}/>
                {", "}
            </>
        )}
        {"and "}
        <ListItem {...{style, className, item: list[list.length - 1]}} key={list.length - 1}/>
    </>;
}

const BodyMeta: FC<Pick<
    ChallDropProps["metadata"],
    "solveCount" | "categories" | "points" | "tags" | "authors"
>> = ({ solveCount, categories, points, authors }) => (
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
        <div className="mt-auto">
            By <EnglishList className="font-mono text-yellow-100" items={[...authors, "sky", "yusuf", "anli"]}/>
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
                <span className="text-lg mb-1.5 block">Netcat servers:</span>
                <code
                    className="
                        border-slate-600 border-2 bg-slate-800 rounded-lg
                        text-pink-400
                        w-max py-2 px-6
                        flex flex-col">{
                    urls.map(url => <span key={url} className="my-1">nc {getFileName(url)}</span>)
                }</code>
            </div>;

    }
};

const ChallDropBody: FC<ChallDropProps & { open: boolean }> = ({
    metadata: { solveCount, categories, points, tags, desc, links, authors },
    solved,
    submission: { challId, userId, teamId }
}) => (
    <div
        className="
            border-slate-600 border border-t-0
            bg-white bg-opacity-10 text-white
            min-h-max max-w-full
            grid"
        style={{
            gridTemplateAreas: "'cntn meta' 'flag flag'",
            gridTemplateColumns: "3fr 1fr",
        }}>
        <div className="m-5 mt-10" style={{ gridArea: "cntn" }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}>
                {desc}
            </ReactMarkdown>
            <div className="
                border-t-1 border-white border-opacity-20 border-t
                pt-3 mt-3 w-full
                flex flex-col gap-4">
                <h4 className="text-xl font-bold">Resources:</h4>

                <Links urls={links.nc} type={"nc"} key={"nc"}/>
                <Links urls={links.web} type={"web"} key={"web"}/>
                <Links urls={links.admin} type={"admin"} key={"admin"}/>
                <Links urls={links.web} type={"static"} key={"static"}/>
            </div>
        </div>

        <BodyMeta {...{ solveCount, solved, points, tags, categories, links, authors }}/>

        <ChallDropFlagInput {...{ challId, teamId, userId }} />

    </div>
);

export default ChallDropBody;
