import React, { useState } from "react";

interface ActionModalProps {
    actionName: string;
    modalAction: (() => Promise<unknown>) | null;
    clearAction: () => void;
}

function ActionModal({ actionName, modalAction, clearAction }: ActionModalProps) {
    const [actionRunning, setActionRunning] = useState(false);

    if (!modalAction) return <></>;

    return <>
        <div
            onClick={clearAction}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-50"/>
        <div className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            w-1/2 max-h-1/2 rounded-xl
            bg-slate-700 
            flex flex-col align-middle
            p-4">
            <h1 className="text-2xl mx-auto text-center">Are you <strong>sure</strong> you want to {actionName}?</h1>
            <br/><br/><br/>
            <div className="w-2/3 min-w-44 flex flex-row space-x-3 mx-auto mb-4">
                <button
                    onClick={() => {
                        setActionRunning(true);
                        modalAction().then(() => {
                            setActionRunning(false)
                            clearAction();
                        });
                    }}
                    disabled={actionRunning}
                    className="bg-red-900 font-bold p-1 rounded-md flex-grow w-1/4">
                    {actionRunning ? "•••" : "Yes"}
                </button>
                <button
                    onClick={() => clearAction()}
                    disabled={actionRunning}
                    className="bg-slate-800 p-1 rounded-md flex-grow w-1/4">
                    No
                </button>
            </div>
        </div>
    </>;
}


export default ActionModal;
