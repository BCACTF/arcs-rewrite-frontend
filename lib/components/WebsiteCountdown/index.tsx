import React, { CSSProperties, FC, ReactNode } from "react";
import { Environment } from "metadata/env";
import { CompetitionMetadata, JsonDate } from "metadata/general"
import useInterval from "hooks/useInterval";
import useRerender from "hooks/useRerender";
import now, { DurationComponents, durationToComponents } from "utils/dates";
import { wrapInSpan } from "utils/html";
import Image from "next/image";

const event_logo_url = process.env.NEXT_PUBLIC_EVENT_LOGO_URL;

if(typeof event_logo_url === "undefined") {
    throw new Error("EVENT_LOGO_URL not defined. Check your .env file.");
}

export interface WebsiteCountdownProps {
    compMeta: CompetitionMetadata;
    envConfig: Environment;

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

const getState = (start: JsonDate, end: JsonDate) => {
    if (now() < start) {
        return CompetitionState.Before;
    } else if (now() > end) {
        return CompetitionState.After;
    } else {
        return CompetitionState.During;
    }
};


const getDuration = (start: JsonDate, end: JsonDate, state: CompetitionState): JsonDate => {
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
    compMeta,
    className,
    state: optState,
    formatter: optFormatter,
}) => {
    const state = optState ?? getState(compMeta.start, compMeta.end);
    const formatter = optFormatter ?? defaultFormatter;

    const duration = getDuration(compMeta.start, compMeta.end, state);
    const componentNumbers = durationToComponents(duration, 1);
    

    const componentElements = wrapComponents(mapComponents(componentNumbers, (n => `${n}`.padStart(2, "0"))), className?.numbers);

    const renderCallback = useRerender();
    useInterval(renderCallback, 1000);

    return (
        <div className="text-center text-4xl">
            <div>
                {/* <div className="bg-event-logo h-[50vh] w-screen bg-cover bg-no-repeat m-auto"> </div> */}
                <Image 
                    src={event_logo_url}
                    alt={"Event Logo"}
                    height={400}
                    width={400}
                />
                <div className="text-landing-text-color">
                    {compMeta.name + stateText(state)}
                </div>
                <div className="text-landing-timer-color">
                    {formatter(componentElements)}
                </div>
            </div>
        </div>
    );
};

export default WebsiteCountdown;