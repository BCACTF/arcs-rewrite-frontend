import React from "react";

export interface DropdownHeaderProps {
    children: React.ReactNode;
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ children, collapsed, setCollapsed }) => {
    return (
        <div
            className="
                bg-slate-800
                rounded-2xl aria-expanded:rounded-b-none transition-all duration-500
                p-4 flex flex-row align-middle
                text-xl"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}>
            <div
                className="
                    rotate-45 aria-checked:-rotate-135
                    translate-y-1 aria-checked:translate-y-2
                    transition-transform duration-500
                    mr-4 ml-1
                    border-r-2 border-b-2 border-cyan h-3 w-3"
                aria-checked={collapsed}/>
            {children}
        </div>
    );
};

export default DropdownHeader;

