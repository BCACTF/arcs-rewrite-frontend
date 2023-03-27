// Components
import Collapsible from "react-collapsible";

// Hooks


// Types

import { FC } from "react"


// Styles
import rawStyles from './ChallDropBody.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ClientSideMeta } from "cache/challs";
import { ReactSVG } from "react-svg";
import { ChallDropProps } from "./ChallDrop";
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

const ChallDropBody: FC<ChallDropProps & { open: boolean }> = ({ metadata: { name, solveCount, categories, points, tags, desc, links, authors }, solved, open }) => (
    <div className={builder.dropBody.IF(open).open()}>
        {/* <h3 className={styles.title}>{name}</h3> */}
        <p className={styles.desc}>{desc}</p>

        <BodyMeta {...{ solveCount, solved, points, tags, categories, links, authors }}/>

        <div className={styles.flagInput}>
            <input type="text" placeholder="bcactf{...}"/>
            <input type="submit"/>
        </div>

    </div>
);

export default ChallDropBody;
