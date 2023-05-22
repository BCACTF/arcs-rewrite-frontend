import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export enum OAuthProvider {
    GITHUB = "github",
    GOOGLE = "google",
    APPLE = "apple",
}

const useAccount = () => {
    const session = useSession();


    const sessionStatus = session.status;
    const signInMemoized = useCallback(
        (provider: OAuthProvider) => {
            if (sessionStatus === "unauthenticated") return signIn(provider);
            else return Promise.resolve();
        },
        [sessionStatus]
    );

    return [session, signInMemoized, signOut];
};

export default useAccount;