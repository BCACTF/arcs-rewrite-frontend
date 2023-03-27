// Components
import Collapsible from "react-collapsible";

// Hooks


// Types

import { FC } from "react"


// Styles
import rawStyles from './ChallDropHeader.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
import { ClientSideMeta } from "cache/challs";
import { ReactSVG } from "react-svg";
import { ChallDropProps } from "./ChallDrop";
const [styles, builder] = wrapCamelCase(rawStyles);


// Utils

const Tag = ({ name }: { name: string }) => (<span className={styles.tag}>{name}</span>);

const ChallDropHeader: FC<ChallDropProps & { open: boolean }> = ({ metadata: { name, solveCount, categories, points, tags }, solved, open }) => (
    <div className={builder.dropHeader.IF(open).open()}>
        <ReactSVG className={builder.chevron.IF(open).open()} src="/icons/chevron.svg" wrapper={"span"} />

        <h3 className={styles.title}>{name}</h3>

        <span className={builder.tagSpan.IF(open).open()}>
            {tags.map((tag, idx) => <Tag name={tag} key={idx} />)}
        </span>

        <span className={builder.categoryPointSpan.IF(open).open()}>
            <span aria-label="category" className={styles.category}>{categories[0]}</span>
            <span className={styles.points}>{points} points</span>
        </span>
        
        <span className={builder.solveSpan.IF(open).open()}>
            <span className={styles.solves}>
                {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} solves
            </span>
            <span className={styles.solveState}>
                {solved.byTeam || solved.byUser ? "Solved" : "Unsolved"}
            </span>
        </span>
    </div>
);

export default ChallDropHeader;
