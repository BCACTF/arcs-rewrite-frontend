import { useRef } from "react";

export interface DropdownBodyProps {
    children: React.ReactNode;
    collapsed: boolean;

    extraPx?: number;
}

const DropdownBody: React.FC<DropdownBodyProps> = ({ children, collapsed, extraPx }) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div 
            className={`
                aria-disabled:opacity-0 overflow-hidden
                aria-disabled:p-0 p-4 
                transition-all duration-500
                bg-slate-900
                flex flex-col space-y-3
                rounded-b-2xl
            `}
            style={{ height: collapsed ? `0px` : `${Number(ref.current?.scrollHeight) + (extraPx ?? 0)}px` }}
            ref={ref}
            aria-disabled={collapsed}>
            {children}
        </div>
    );
};

export default DropdownBody;


