import { useRouter } from "next/router";
import { useCallback } from "react";

const useServerSidePropsRefetcher = () => {
    const router = useRouter();
    const refreshMemoized = useCallback(
        () => { router.replace(router.asPath) },
        [router],
    );

    return refreshMemoized;
};

export default useServerSidePropsRefetcher;