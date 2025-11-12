// Tipos compartidos del proyecto (usado por frontend y para evitar import runtime issues)
export type Player = {
    id: string;
    name: string;
};

export type MissionResult = {
    team: string[];
    fails: number;
    passed: boolean;
};

export type PublicState = {
    code: string;
    players: Player[];
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    leaderIndex: number;
    currentMission: number;
    teamSizePerMission: number[];
    failsRequired: number[];
    proposedTeam: string[];
    results: MissionResult[];
    rejectedTeamsInRow: number;
    votedPlayers?: string[]; // IDs de jugadores que ya votaron
    playersActed?: string[]; // IDs de jugadores que ya actuaron en la misión
};
