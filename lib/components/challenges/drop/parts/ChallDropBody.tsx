// Components
import Collapsible from "react-collapsible";

// Hooks


// Types

import React, { FC } from "react"


// Styles
import rawStyles from './ChallDropBody.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ClientSideMeta } from "cache/challs";
import { ReactSVG } from "react-svg";
import { ChallDropProps } from "./ChallDrop";
import NoSsr from "components/NoSsr/NoSsr";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils


const Tag = ({ name }: { name: string }) => (<span className={styles.tag}>{name}</span>);

const BodyMeta: FC<Pick<
    ChallDropProps["metadata"],
    "solveCount" | "categories" | "points" | "tags" | "authors" | "links"
>> = ({ solveCount, categories, points, tags, authors, links }) => (
    <div className={styles.meta}>
        <div className={styles.categories}>
            <h4>Categories:</h4>
            {categories.join(", ")}
        </div>
        <div className={styles.points}>
            <h4>Points:</h4>
            {points} points
        </div>
        <div className={styles.solves}>
            <h4>Solves:</h4>
            {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} solves

            <br/>
            <br/>
            
            Your team has not solved this challenge.
        </div>
    </div>
);

const ChallDropBody: FC<ChallDropProps & { open: boolean }> = ({
    metadata: { name, solveCount, categories, points, tags, desc, links, authors },
    solved,
    open,
    submission: { challId, userId, teamId }
}) => (
    <div className={builder.dropBody.IF(open).open()}>
        {(() => { console.log(name, links); return void 0 })()}
        <NoSsr>
            <p className={styles.desc}>
                <p dangerouslySetInnerHTML={{ __html: desc }} />
                <br/>
                <h4 className="text-lg font-bold">Links:</h4>
                {Object.entries(links).map(([name, href], idx) => <><a className="text-blue-300 underline" href={(href as string).startsWith("http") ? href as string : `http://${href}`} key={idx}>{name}</a><br/></>)}
            </p>
        </NoSsr>

        <BodyMeta {...{ solveCount, solved, points, tags, categories, links, authors }}/>

        <div className={styles.flagInput}>
            <input disabled={!userId || !teamId} id={`flaginput-${challId}`} type="text" placeholder="bcactf{...}"/>
            <input type="submit" disabled={!userId || !teamId} onClick={async () => {
                const value = document.querySelector<HTMLInputElement>(`#flaginput-${challId}`)?.value;
                console.log(value);
                if (!value) return;
                else fetch("/api/attempt-solve", {
                    method: "POST",
                    body: JSON.stringify({ challId, userId, teamId, flag: value }),
                })
                    .then(response => response.text())
                    .then(text => text === "false" ? alert("no") : alert("yessssss"))
            }}/>
        </div>

    </div>
);

export default ChallDropBody;
