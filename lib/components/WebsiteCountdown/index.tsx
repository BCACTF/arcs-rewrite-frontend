import React, { CSSProperties, FC, ReactNode } from "react";
import useInterval from "hooks/useInterval";
import useRerender from "hooks/useRerender";
import now, { DurationComponents, durationToComponents } from "utils/dates";
import { wrapInSpan } from "utils/html";
import Image from "next/image";
import { Competition } from "metadata/client";


export interface WebsiteCountdownProps {
    metadata: Competition;

    state?: CompetitionState;

    formatter?: (input: DurationComponents<JSX.Element>) => JSX.Element;
    style?: CSSProperties;
    className?: WebsiteCountdownClassNameProps;
}

interface WebsiteCountdownClassNameProps {
    container?: string;
    numbers?: string;
    text?: string;
}

export enum CompetitionState {
    Before,
    During,
    After,
}

const getState = (start: number, end: number) => {
    if (now() < start) {
        return CompetitionState.Before;
    } else if (now() > end) {
        return CompetitionState.After;
    } else {
        return CompetitionState.During;
    }
};


const getDuration = (start: number, end: number, state: CompetitionState): number => {
    switch (state) {
        case CompetitionState.Before:
            return start - now();
        case CompetitionState.During:
            return end - now();
        case CompetitionState.After:
            return now() - end;
    }
};


const stateText = (state: CompetitionState) => {
    switch (state) {
        case CompetitionState.Before:
            return " starts in";
        case CompetitionState.During:
            return " ends in";
        case CompetitionState.After:
            return " has ended";
    }
};

type WrappedComponentsFn = <T extends ReactNode>(components: DurationComponents<T>, className?: string) => DurationComponents<JSX.Element>;
const wrapComponents: WrappedComponentsFn = ({days, hours, minutes, seconds}, className) => ({
    days: wrapInSpan(days, className),
    hours: wrapInSpan(hours, className),
    minutes: wrapInSpan(minutes, className),
    seconds: wrapInSpan(seconds, className),
})

type MapComponentsFn = <T, O>(components: DurationComponents<T>, mapFn: (input: T) => O) => DurationComponents<O>;
const mapComponents: MapComponentsFn = ({days, hours, minutes, seconds}, mapper) => ({
    days: mapper(days),
    hours: mapper(hours),
    minutes: mapper(minutes),
    seconds: mapper(seconds),
})

const defaultFormatter = ({days, hours, minutes, seconds}: DurationComponents<JSX.Element>) => (
    <div><>days: {days}, hours: {hours}, minutes: {minutes}, seconds: {seconds}</></div>
);

const WebsiteCountdown: FC<WebsiteCountdownProps> = ({
    metadata,
    className,
    state: optState,
    formatter: optFormatter,
}) => {
    const state = optState ?? getState(metadata.start, metadata.end);
    const formatter = optFormatter ?? defaultFormatter;

    const duration = getDuration(metadata.start, metadata.end, state);
    const componentNumbers = durationToComponents(duration, 1);
    

    const componentElements = wrapComponents(mapComponents(componentNumbers, (n => `${n}`.padStart(2, "0"))), className?.numbers);

    const renderCallback = useRerender();
    useInterval(renderCallback, 1000);

    return (
        <div className="text-center text-4xl">
            <div>
                {/* <div className="bg-event-logo h-[50vh] w-screen bg-cover bg-no-repeat m-auto"> </div> */}
                <Image 
                    src={metadata.logoUrl}
                    alt={"Event Logo"}
                    height={400}
                    width={400}
                />
                <div className="text-landing-text-color">
                    {metadata.name + stateText(state)}
                </div>
                <div className="text-landing-timer-color">
                    {formatter(componentElements)}
                </div>
            </div>
        </div>
    );
};

export default WebsiteCountdown;