import { DeployStatus } from "hooks/admin/useDeployStatus";
import React from "react";

export interface DeployStatusProps {
    deployStatus: DeployStatus;
}

const StatusDot = ({ className }: { className: string }) => {
    return <div className={`w-3 h-3 rounded-full ${className}`} />;
};

const DeployStatus: React.FC<DeployStatusProps> = ({ deployStatus: status }) => {
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
