import { ChallId, UserId } from "./newtypes";

export interface UserSolve {
    challId: ChallId;
    challPoints: number;
    solveTime: Date;
}

export interface TeamSolve {
    challId: ChallId;
    challPoints: number;
    solveTime: Date;
    solver: UserId;
}



export const serUserSolve = (solve: UserSolve) => ({
    challId: solve.challId.formatted,
    solveTime: solve.solveTime.getTime(),
    challPoints: solve.challPoints,
});

export const serTeamSolve = (solve: TeamSolve) => ({
    challId: solve.challId.formatted,
    solveTime: solve.solveTime.getTime(),
    challPoints: solve.challPoints,
    solver: solve.solver.formatted,
});

export const deserUserSolve = (solve: ReturnType<typeof serUserSolve>): UserSolve | null => {
    const challId = ChallId.parse(solve.challId);
    const solveTime = new Date(solve.solveTime);
    const challPoints = solve.challPoints;

    if (!challId) return null;

    return { challId, solveTime, challPoints };
};

export const deserTeamSolve = (solve: ReturnType<typeof serTeamSolve>): TeamSolve | null => {
    const challId = ChallId.parse(solve.challId);
    const solveTime = new Date(solve.solveTime);
    const solver = UserId.parse(solve.solver);
    const challPoints = solve.challPoints;

    if (!challId || !solver) return null;

    return { challId, solveTime, challPoints, solver };
};
