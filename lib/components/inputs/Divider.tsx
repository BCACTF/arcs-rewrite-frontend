// Components


// Hooks


// Types

import { FC } from "react"


// Styles


// Utils


interface DividerProps {
    extraClasses?: string;
}


const Divider: FC<DividerProps> = (props) => (
    <div className={`border-t w-4/5 border-slate-600 border-opacity-60 ${props.extraClasses ?? ""}`}/>
);

export default Divider;
