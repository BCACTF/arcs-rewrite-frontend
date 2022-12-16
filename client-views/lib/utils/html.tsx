import { ReactNode } from "react";

export const wrapInSpan: <T extends ReactNode>(input: T, className?: string) => JSX.Element = (input, className) => <span className={className}>{input}</span>;
