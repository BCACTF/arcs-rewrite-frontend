// Components


// Hooks


// Types

import { ClientSideMeta } from "cache/challs";
import { FilterStateHook } from "hooks/useFilter";
import React, { FC, useMemo } from "react"


// Styles
import rawStyles from './FilterView.module.scss';
import { wrapCamelCase } from "utils/styles/camelcase";
const [styles, builder] = wrapCamelCase(rawStyles);

// Utils


interface CheckBoxProps {
    checked: boolean;
    set: (state: boolean) => void;
    label: React.ReactNode;
}

const CheckBox: FC<CheckBoxProps> = ({ checked, set, label: inner }) => (
    <span className="flex items-center mb-3">
        <input
            type="checkbox"
            onChange={() => set(!checked)}
            className="
                bg-transparent checked:bg-indigo-500
                appearance-none cursor-pointer peer

                w-8 h-8 mr-3
                
                border-4 rounded-sm
                border-gray-400 checked:border-indigo-100"/>
        <label className="text-xl text-gray-400 peer-checked:text-indigo-100">{inner}</label>
    </span>
);


interface FilterViewProps {
    filterState: FilterStateHook;
    challs: ClientSideMeta[];
}

const FilterView: FC<FilterViewProps> = ({ filterState, challs }) => {
    const categories = useMemo(
        () => [...new Set(challs.flatMap(c => c.categories).map(s => s.toLowerCase())).values()].sort(),
        [challs],
    );
    const tags = useMemo(
        () => [...new Set(challs.flatMap(c => c.tags).map(s => s.toLowerCase())).values()].sort(),
        [challs],
    );
    const pointsMax = useMemo(() => Math.max(...challs.map(c => c.points)), [challs]);

    console.log({ categories, tags, pointsMax });

    const categorySelectors = <div className="flex flex-col justify-start items-start w-60 border-2 border-gray-600 p-4">
        <h4 className="border-b-2 border-b-gray-400 w-full mb-4 text-2xl pb-1">Categories:</h4>
        {categories.map(
            (cat, idx) => <CheckBox
                key={idx}
                checked={filterState.currState.categories?.has(cat) ?? false}
                set={v => filterState.setCategory(cat, v)}
                label={<span className={styles.checkBoxLabel}>{cat.toUpperCase()}</span>}/>
        )}
    </div>;

    // const     

    return categorySelectors;
};

export default FilterView;
