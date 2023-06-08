// Components


// Hooks
import { useEffect, useMemo, useState } from "react";

// Types

import React, { FC } from "react";


// Styles


// Utils


interface PointsRangeFilterProps {
    max: number;
    range: [number, number];
    set: { low: (v: number) => void; high: (v: number) => void; unknown: (v: number) => void; };
    stops: number[];
}

enum Moving {
    NONE,
    LOW,
    HIGH,
    UNKNOWN,
}

const PointsRangeFilter: FC<PointsRangeFilterProps> = ({ max, range: [vLo, vHi], set: { low, high, unknown }, stops }) => {
    const [moving, setMoving] = useState<Moving>(Moving.NONE);

    
    const onMouseMoveCallback = useMemo(
        () => {
            if (moving !== Moving.NONE) return (e: React.MouseEvent<HTMLSpanElement>) => {
                const xRaw = e.clientX;
                const { x, width } = e.currentTarget.getBoundingClientRect();
                const percentage = (xRaw - x) / width;
                const rawVal = percentage * max;
                const clamped = Math.max(0, Math.min(max, rawVal));

                const closestStop = [...stops, 0]
                    .map(val => [val, Math.abs(clamped - val)] as const)
                    .sort((a, b) => a[1] - b[1])[0][0];

                switch (moving) {
                    case Moving.LOW:
                        low(Math.round(closestStop));
                        break;
                    case Moving.HIGH:
                        high(Math.round(closestStop));
                        break;
                    case Moving.UNKNOWN:
                        unknown(Math.round(closestStop));
                        break;
                }
            };
            else return undefined;
        },
        [moving, low, high, unknown, max, stops],
    );

    useEffect(() => {
        const callback = () => setMoving(Moving.NONE);
        document.addEventListener('mouseup', callback);
        return () => document.removeEventListener('mouseup', callback);
    }, [setMoving, low]);

    const loPercentage: number = vLo / max * 100;
    const hiPercentage: number = vHi / max * 100;

    const [loLeft, hiLeft] = [`${loPercentage}%`, `${hiPercentage}%`];

    const stopsActive = [0, ...stops, max].map(stop => [
        `${stop / max * 100}%`,
        vLo <= stop && stop <= vHi ? "bg-play-pointselector-dot-color-active" : "bg-play-pointselector-dot-color-inactive",
        stop,
        vLo <= stop && stop <= vHi ? "font-bold" : "",
    ] as const);

    const loMoving = vLo === vHi ? Moving.UNKNOWN : Moving.LOW;
    const hiMoving = vLo === vHi ? Moving.UNKNOWN : Moving.HIGH;

    return <span className="w-full flex flex-col h-36">
        <h4 className="border-b border-b-play-selector-line-divider-color w-full text-2xl pb-1">Points:</h4>
        <span
            className="h-44 pt-2 transparent flex items-center relative ml-4 mr-6"
            onMouseMoveCapture={onMouseMoveCallback}>

            {/* Main line */}
            <>
                {/* Whole part */}
                <span className="h-1 w-full bg-play-pointselector-default-line-color"/>
                {/* Selected part */}
                <span className="h-1 bg-play-pointselector-dot-color-active 100 absolute" style={{ left: `${loPercentage}%`, right: `${100 - hiPercentage}%` }}/>
            </>

            {/* Stop points */}
            <>
                {/* Stop point circles */}
                {stopsActive.map(
                    ([left, active], idx) => <span
                        key={idx}
                        className={"h-3 rounded-full w-3 absolute -translate-x-1.5 " + active}
                        style={{ left }}/>
                )}

                {/* Stop point labels */}
                {stopsActive.filter(([,, stop,]) => stop % 50 === 0).map(
                    ([left,, stop, color], idx) => <span
                        key={"label" + idx}
                        className={`-rotate-60 text-right w-12 absolute -translate-x-10 translate-y-10 select-none ${color}`}
                        style={{ left }}>
                        {stop}
                    </span>
                )}
            </>

            {/* Dragpoints */}
            <>
                {/* Above-dragpoint labels */}
                <>
                    <span style={{ left: loLeft }} className="-rotate-60 absolute -translate-x-1 -translate-y-8 w-8 text-left select-none">
                        {vLo}
                    </span>
                    {vLo !== vHi && <span style={{ left: hiLeft }} className="-rotate-60 absolute -translate-x-1 -translate-y-8 w-8 text-left select-none">
                        {vHi}
                    </span>}
                </>

                {/* Dragpoint circles/handles */}
                <span
                    className="h-5 rounded-full bg-play-pointselector-dot-color-active w-5 absolute -translate-x-1/2"
                    style={{ left: loLeft }}
                    onMouseDownCapture={() => setMoving(loMoving)}/>
                <span
                    className="h-5 rounded-full bg-play-pointselector-dot-color-active w-5 absolute -translate-x-1/2"
                    style={{ left: hiLeft}}
                    onMouseDownCapture={() => setMoving(hiMoving)}/>
            </>
        </span>
    </span>;
};

export default PointsRangeFilter;
