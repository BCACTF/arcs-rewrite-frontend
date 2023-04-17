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
                bg-transparent checked:bg-indigo-500
                appearance-none cursor-pointer peer

                w-6 h-6 mr-2
                
                border-3 rounded-sm
                border-gray-400 checked:border-indigo-100"/>
        <label
            // onClickCapture={}
            className="text-xl text-gray-400 peer-checked:text-indigo-100">
            {inner}
        </label>
    </span>
);

interface ChallCheckFilterProps {
    list: string[];
    heading: string;
    has: (item: string) => boolean,
    set: (item: string, value: boolean) => void,
}


const ChallCheckFilter: FC<ChallCheckFilterProps> = ({ list, heading, has, set }) => (
    <div className="flex flex-col justify-start items-start w-full">
        <h4 className="border-b border-b-gray-400 w-full mb-4 text-2xl pb-1">{heading}</h4>
        {list.map(
            (item, idx) => <CheckBox
                key={idx}
                checked={has(item)}
                set={v => set(item, v)}
                label={item}/>
        )}
    </div>
);

export default ChallCheckFilter;
