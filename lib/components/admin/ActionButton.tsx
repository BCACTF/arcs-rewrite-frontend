import useServerSidePropsRefetcher from "hooks/useServerSidePropsRefetcher";
import { useCallback } from "react";

const ActionButton = ({
    confirmed, doubleConfirmed,
    action, actionName,
    setModalAction,
    children, className,
}: {
    confirmed: boolean, doubleConfirmed?: boolean,
    action: () => Promise<unknown>, actionName: string,
    setModalAction: (action: [() => Promise<unknown>, string, boolean]) => void,
    children: React.ReactNode, className?: string,
}) => {
    const refetch = useServerSidePropsRefetcher();

    const actionThenRefresh = useCallback(() => action().then(success => success && refetch()), [refetch]);
    
    const clickCallback = useCallback(
        () => confirmed
            ? setModalAction([actionThenRefresh, actionName, !!doubleConfirmed])
            : actionThenRefresh(),
        [confirmed, actionThenRefresh],
    );

    return (
        <button
            onClick={clickCallback}
            className={className + " p-1 rounded-md cursor-pointer"}>
            {children}
        </button>
    );
};

export default ActionButton;
