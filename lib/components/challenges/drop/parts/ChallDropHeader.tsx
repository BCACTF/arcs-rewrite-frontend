// Components
import { ReactSVG } from "react-svg";

// Hooks


// Types
import React, { FC } from "react";
import { ChallDropProps } from "./ChallDrop";

// Styles
import rawStyles from './ChallDropHeader.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles); // FIXME: Tailwindify.

// Utils

const Tag = ({ name }: { name: string }) => (<span className={styles.tag}>{name}</span>);

const ChallDropHeader: FC<ChallDropProps & { open: boolean }> = ({ metadata: { name, solveCount, categories, points, tags }, solved, open }) => (
    <div className={builder.dropHeader.IF(open).open()}>
        {/* <ReactSVG className={`${builder.chevron.IF(open).open()} mx-4 mt-0.5 flex w-4`} src="/icons/chevron.svg" wrapper={"span"} /> */}

        <h3 className="text-sm sm:text-md md:text-md lg:text-lg sm:pl-4 font-bold my-auto px-2 mr-auto w-1/3">{name}</h3>

        {
            tags.length > 0 ? 
            (
                <span className="py-4 my-auto mx-4 w-32 overflow-scroll overflow-y-hidden">
                    {tags.map((tag, idx) => <Tag name={tag} key={idx} />)}
                </span>
            ) : null
        }

        <span className="max-h-min my-auto flex justify-end items-center">
            <span
                aria-label="category"
                className="w-20 text-right px-2 py-2 pl-4 border-l border-spacer-dropdown max-sm:hidden">
                {categories[0]}
            </span>
            <span className="sm:w-28 text-right px-2 py-2 max-sm:hidden">
                {points.toLocaleString('en-US', {maximumFractionDigits: 0})} points
            </span>
            <span className="sm:w-28 text-right px-2 py-2 sm:hidden">
                {points.toLocaleString('en-US', {maximumFractionDigits: 0})} pts
            </span>
            <span className="sm:w-16 md:w-24 text-right px-2 py-2 pr-4 max-sm:hidden">
                {solveCount.toLocaleString('en-US', {maximumFractionDigits: 0})} {solveCount === 1 ? "solve" : "solves"}
            </span>
        </span>
        <span className={"border-l-2 border-spacer-dropdown flex justify-center items-center w-[30%] sm:p-5 sm:px-7 ml-1 sm:w-[16%] lg:max-w-[10%]" + ( (solved.byTeam || solved.byUser) ? " bg-chall-solved-side-color" : " bg-chall-unsolved-side-color" )}>
            {(solved.byTeam || solved.byUser) ? "Solved" : "Unsolved"}
        </span>
    </div>
);

export default ChallDropHeader;
