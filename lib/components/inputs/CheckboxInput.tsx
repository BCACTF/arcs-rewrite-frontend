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
    <label className="flex flex-row items-center space-x-4 place-content-center w-5/6" htmlFor={props.id}>
        <input 
            type="checkbox"
            className="
                w-6 h-6
                bg-black bg-opacity-10 appearance-none
                checked:bg-signin-provider-hover-color
                border-2 border-signin-provider-outline rounded-lg

                checked:after:border-b-2 after:border-b-white
                checked:after:border-r-2 after:border-r-white
                
                relative after:absolute
                after:h-1/2 after:w-1/3 after:top-1/4 after:left-1/3
                after:rotate-45 after:-translate-y-0.5"
            {...omitted(props, ["children"])}/>
        <span className="flex-grow">{props.children}</span>
    </label>
);

export default CheckboxInput;
