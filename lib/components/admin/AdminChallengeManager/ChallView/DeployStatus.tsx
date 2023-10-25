import { CachedChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import NoSsr from "components/NoSsr/NoSsr";
import useDeployStatus, { DeployStatus } from "hooks/useDeployStatus";
import React from "react";

export interface DeployStatusProps {
    challenge: CachedChall;
    solves: CachedSolveMeta[];
}

const getSolveTimeString = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleString();
};


const StatusDot = ({ className }: { className: string }) => {
    return <div className={`w-3 h-3 rounded-full ${className}`} />;
};


const DeployStatus: React.FC<DeployStatusProps> = ({ challenge, solves }) => {
    const firstSolve = solves.sort((a, b) => a.time - b.time)[0];
    const solveTime = firstSolve?.time ? getSolveTimeString(firstSolve.time) : "N/A";

    const status = useDeployStatus(challenge.id);

    const color = ((status: DeployStatus) => {
        switch (status.status) {
            case "loading": return "bg-gray-500";
            case "idle": return "bg-green-500";
            case "error": return "bg-red-500";
            case "working": return "bg-yellow-500";
        }
    })(status);
    const text = ((status: DeployStatus) => {
        switch (status.status) {
            case "loading": return "Fetching data...";
            case "idle": return "Not currently deploying";
            case "error": return `Error: ${status.error}`;
            case "working": return `Deploying: ${(status.amount * 100).toFixed(2)}%`;
        }
    })(status);

    return (
        <div className="flex flex-row items-center space-x-2 relative pl-1" title={text} >
            <StatusDot className={color} />
            <span className="absolute overflow-ellipsis overflow-hidden whitespace-nowrap left-4 w-full pr-5 z-0">{text}</span>
        </div>
    );
}

export default DeployStatus;
