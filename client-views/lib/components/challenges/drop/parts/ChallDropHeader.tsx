// Components
import { ReactSVG } from "react-svg";

// Hooks


// Types
import React, { FC } from "react";
import { ChallDropProps } from "./ChallDrop";

// Styles
import rawStyles from './ChallDropHeader.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils

const Tag = ({ name }: { name: string }) => (<span className={styles.tag}>{name}</span>);

const ChallDropHeader: FC<ChallDropProps & { open: boolean }> = ({ metadata: { name, solveCount, categories, points, tags }, solved, open }) => (
    <div className={builder.dropHeader.IF(open).open()}>
        <ReactSVG className={`${builder.chevron.IF(open).open()} mx-4 mt-0.5 flex w-4`} src="/icons/chevron.svg" wrapper={"span"} />

        <h3 className={styles.title}>{name}</h3>

        <span className="py-4 my-auto mx-4 w-32 overflow-scroll overflow-y-hidden">
            {tags.map((tag, idx) => <Tag name={tag} key={idx} />)}
        </span>

        <span className="max-h-min my-auto flex justify-end items-center">
            <span
                aria-label="category"
                className="w-20 text-right px-2 py-2 pl-4 border-l border-spacer-dropdown">
                {categories[0]}
            </span>
            <span className="w-28 text-right px-2 py-2">
                {points.toLocaleString('en-US', {maximumFractionDigits: 0})} points
            </span>
            <span className="w-32 text-right px-2 py-2 pr-4">
                {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} solves
            </span>
        </span>
        <span className="bg-slate-800 border-l-2 border-spacer-dropdown flex justify-center items-center p-5">
            {solved.byTeam || solved.byUser ? "Solved" : "Unsolved"}
        </span>
    </div>
);

export default ChallDropHeader;
