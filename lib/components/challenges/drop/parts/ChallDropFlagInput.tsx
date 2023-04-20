// Components

// Hooks
import { useState } from "react";

// Types
import React, { FC } from "react";
import { ChallId, TeamId, UserId } from "cache/ids";

// Styles

// Utils


interface ChallDropFlagInputProps {
    challId: ChallId;
    teamId: TeamId | null;
    userId: UserId | null;
}

const ChallDropFlagInput: FC<ChallDropFlagInputProps> = ({challId, userId, teamId }) => {
    const [inputValue, setInputValue] = useState("");

    const inputDisabled = !userId || !teamId;

    return <div
        className="flex items-center m-5 relative group"
        style={{ gridArea: "flag"}}
        aria-disabled={inputDisabled}>
        <input
            className="
                flex-grow-10
                text-sm bg-white bg-opacity-5
                disabled:opacity-50
                border border-white border-opacity-30 border-r-0 rounded-l-xl
                p-3 pl-6"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={inputDisabled} type="text" id={`flaginput-${challId}`}
            placeholder="bcactf{...}"/>
        <input
            className="
            flex-grow
            text-sm bg-white bg-opacity-20
            disabled:opacity-50
            border border-slate-600 border-l-0 rounded-r-xl p-3"
            disabled={inputDisabled} type="submit"
            onClick={async () => {
                if (!inputValue) return;
                else {
                    const res = await fetch("/api/attempt-solve", {
                        method: "POST",
                        body: JSON.stringify({ challId, userId, teamId, flag: inputValue }),
                    });
                    const text = await res.text();
                    if (text === "false") alert("no");
                    else alert("yessssss");
                }
            }}/>
        <div
            aria-disabled={!inputDisabled}
            className="
                absolute -top-2 -translate-y-full
                text-center content-center
                border border-slate-500 rounded-xl bg-slate-900
                py-2 left-1/4
                w-1/2 opacity-0
                group-hover:opacity-75
                delay-500
                transition-all duration-500">
                You must be logged in and on a team to submit flags.
            </div>
    </div>
};

export default ChallDropFlagInput;
