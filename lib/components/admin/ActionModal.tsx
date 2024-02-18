import React, { useState } from "react";

interface ActionModalProps {
    actionName: string;
    doubleConfirm?: boolean;
    modalAction: (() => Promise<unknown>) | null;
    clearAction: () => void;
}

function ActionModal({ actionName, modalAction, clearAction, doubleConfirm }: ActionModalProps) {
    const [actionRunning, setActionRunning] = useState(false);
    const [canConfirm, setCanConfirm] = useState(false);

    const disableRun = doubleConfirm && !canConfirm;

    if (!modalAction) return <></>;

    return <>
        <div
            onClick={clearAction}
            className="fixed top-0 left-0 w-screen h-screen !my-0 bg-slate-900 opacity-50 z-50"/>
        <div className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            w-1/2 min-h-1/2 rounded-xl
            bg-slate-700 
            flex flex-col align-middle
            p-4">
            <h1 className="text-2xl mx-auto text-center">Are you <strong>sure</strong> you want to {actionName}?</h1>
            <br/><br/><br/>
            {doubleConfirm && (
                <div className="flex flex-row items-center justify-center space-x-3">
                    <label
                        htmlFor="DoubleConfirmCheckbox"
                        className="text-xl font-bold"
                        onClick={e => e.preventDefault()}>
                        Yes I'm 100% sure I want to do this.
                    </label>
                    <input
                        onChange={(e) => {
                            if (e.target.checked) {
                                e.target.disabled = true;
                                setTimeout(() => {
                                    e.target.disabled = false;
                                    setCanConfirm(true);
                                }, 1000);
                            } else {
                                setCanConfirm(false);
                            }
                        }}
                        type="checkbox"
                        className="
                            bg-red-900 checked:bg-red-700
                            border-4 border-red-500
                            rounded-lg w-8 h-8
                            appearance-none relative
                            
                            after:absolute
                            after:border-b-3 after:border-r-3 after:w-2.5 after:h-4
                            after:rotate-45 after:translate-x-0 after:left-[0.45rem] after:top-[0.05rem]
                            after:opacity-0 checked:after:opacity-100"
                            id="DoubleConfirmCheckbox"
                            name="DoubleConfirmCheckbox"/>
                    <br/>
                </div>
            )}
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
                    disabled={actionRunning || disableRun}
                    aria-disabled={disableRun}
                    className="
                        bg-red-900 p-1 rounded-md flex-grow w-1/4
                        font-bold
                        opacity-100 aria-disabled:opacity-50 transition-opacity duration-300
                        aria-disabled:duration-0">
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
