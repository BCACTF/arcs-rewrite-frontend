// Components


// Hooks


// Types
import React, { FC } from "react"


// Styles


// Utils


interface CheckBoxProps {
    checked: boolean;
    set: (state: boolean) => void;
    label: React.ReactNode;
}

const CheckBox: FC<CheckBoxProps> = ({ checked, set, label: inner }) => (
    <span
        className="flex items-center mb-3"
        onClickCapture={() => set(!checked)}>
        <input
            type="checkbox"
            checked={checked}
            onChange={() => set(!checked)}
            className="
                bg-transparent 
                transition
                checked:bg-play-button-selected-fill-color

                hover:bg-play-button-hover-unselected-fill-color
                checked:hover:bg-play-button-hover-selected-fill-color

                appearance-none cursor-pointer peer

                w-6 h-6 mr-2
                
                border-3 rounded-sm
                border-play-button-outline-color checked:border-play-button-selected-outline-color"/>
        <label
            // onClickCapture={}
            className="
                text-xl
                transition
                text-play-button-default-text-color
                peer-hover:text-play-button-hover-unselected-text-color
                peer-checked:peer-hover:text-play-button-hover-selected-text-color

                peer-checked:text-play-button-selected-text-color">
            {inner}
        </label>
    </span>
);

interface ChallCheckFilterProps {
    list: ([string, [number, number]] | string)[];
    heading: string;
    has: (item: string) => boolean,
    set: (item: string, value: boolean) => void,
}


const ChallCheckFilter: FC<ChallCheckFilterProps> = ({ list, heading, has, set }) => (
    <div className="flex flex-col justify-start items-start w-full">
        <h4 className="border-b border-b-play-selector-line-divider-color w-full mb-4 text-2xl pb-1">{heading}</h4>
        {list.map(
            (input, idx) => typeof input === "string"
                ? <CheckBox
                    key={idx}
                    checked={has(input)}
                    set={v => set(input, v)}
                    label={input}/>
                : <CheckBox
                    key={idx}
                    checked={has(input[0])}
                    set={v => set(input[0], v)}
                    label={`${input[0]} (${input[1][0]}/${input[1][1]})`}/>
        )}
    </div>
);

export default ChallCheckFilter;
