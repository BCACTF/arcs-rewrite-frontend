// Components


// Hooks


// Types

import { ComponentProps, FC, ReactNode } from "react"


// Styles


// Utils
import { omitted } from "utils/general";


interface CheckboxInputProps extends ComponentProps<"input"> {
    children: ReactNode;
    id: string;
}


const CheckboxInput: FC<CheckboxInputProps> = (props) => (
    <label className="flex flex-col sm:flex-row items-center sm:space-x-4 place-content-center w-11/12 sm:w-5/6" htmlFor={props.id}>
        <input 
            type="checkbox"
            className="
                w-1/3 h-8 sm:w-6 sm:h-6 sm:aspect-square
                bg-black bg-opacity-10 appearance-none
                checked:bg-signin-provider-hover-color
                border-2 border-signin-provider-outline rounded-lg

                checked:after:border-b-2 after:border-b-white
                checked:after:border-r-2 after:border-r-white
                
                relative after:absolute
                after:h-1/2 after:w-2 after:top-1/2 after:left-1/2
                after:-translate-x-1/2 after:-translate-y-3/4
                after:rotate-45"
            {...omitted(props, ["children"])}/>
        <span className="flex-grow text-center sm:text-start mt-2 sm:mt-0 text-signin-text">{props.children}</span>
    </label>
);

export default CheckboxInput;
