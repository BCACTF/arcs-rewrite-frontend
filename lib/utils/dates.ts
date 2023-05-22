// export const jsonToDate = (json: JsonDate) => new Date(json);
// export const dateToJson = (date: Date) => date.getTime() / 1000;

export type DurationComponents<T> = { days: T, hours: T, minutes: T, seconds: T };
export const durationToComponents = (duration: number, multiple = 1): DurationComponents<number> => {
    const secsPerMin = 60;
    const secsPerHr = 60 * secsPerMin;
    const secsPerDay = 24 * secsPerHr;
    return {
        days: Math.floor(duration / secsPerDay),
        hours: Math.floor((duration % secsPerDay) / secsPerHr),
        minutes: Math.floor((duration % secsPerHr) / secsPerMin),
        seconds: (Math.floor(duration * multiple) / multiple) % secsPerMin,
    };
};

const now = () => Date.now() / 1000;

export default now;

