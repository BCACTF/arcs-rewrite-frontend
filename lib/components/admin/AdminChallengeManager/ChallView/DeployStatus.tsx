import { CachedChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import NoSsr from "components/NoSsr/NoSsr";
import useDeployStatus from "hooks/useDeployStatus";
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

    switch (status.status) {
        case "loading":
            return (
                <div className="flex flex-row flex-wrap items-center space-x-2">
                    <StatusDot className="bg-gray-500" />
                    <span>Fetching data...</span>
                </div>
            );
        case "idle":
            return (
                <div className="flex flex-row flex-wrap items-center space-x-2">
                    <StatusDot className="bg-green-500" />
                    <span>Not currently deploying</span>
                </div>
            );
        case "working":
            return (
                <div className="flex flex-row flex-wrap items-center space-x-2">
                    <StatusDot className="bg-yellow-500" />
                    <span>Deploying: {status.amount * 100}%</span>
                </div>
            );
        case "error":
            return (
                <div className="flex flex-row flex-wrap items-center space-x-2">
                    <StatusDot className="bg-red-500" />
                    <span>Error: {status.error}</span>
                </div>
            );
    }

    return (
        <div className="flex flex-row flex-wrap align-middle space-x-2">
            
        </div>
    );
}

export default DeployStatus;
