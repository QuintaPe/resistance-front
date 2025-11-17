/**
 * Tipos relacionados con misiones
 */

export type MissionResult = {
    team: string[];      // IDs de jugadores en el equipo
    fails: number;       // Número de votos para fallar la misión
    passed: boolean;     // Si la misión fue exitosa
};

