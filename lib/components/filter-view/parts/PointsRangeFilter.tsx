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
        vLo <= stop && stop <= vHi ? "bg-purple-500" : "bg-gray-700",
    ] as const);

    const loMoving = vLo === vHi ? Moving.UNKNOWN : Moving.LOW;
    const hiMoving = vLo === vHi ? Moving.UNKNOWN : Moving.HIGH;

    return <span className="w-full flex flex-col mb-4">
        <h4 className="border-b border-b-gray-400 w-full mb-3 text-2xl pb-1">Points:</h4>
        <span
            className="mx-auto w-11/12 h-6 transparent flex items-center relative"
            onMouseMoveCapture={onMouseMoveCallback}>
            <span className="h-1 w-full bg-gray-700"/>
            <span className="h-1 bg-purple-500 100 absolute" style={{ left: `${loPercentage}%`, right: `${100 - hiPercentage}%` }}/>

            {stopsActive.map(
                ([left, active], idx) => <span
                    key={idx}
                    className={"h-3 rounded-full w-3 absolute -translate-x-1.5 " + active}
                    style={{ left }}/>
            )}

            <span
                className="h-5 rounded-full bg-purple-500 w-5 absolute -translate-x-1/2"
                style={{ left: loLeft }}
                onMouseDownCapture={() => setMoving(loMoving)}/>
            <span
                className="h-5 rounded-full bg-purple-500 w-5 absolute -translate-x-1/2"
                style={{ left: hiLeft}}
                onMouseDownCapture={() => setMoving(hiMoving)}/>
        </span>
    </span>;
};

export default PointsRangeFilter;
