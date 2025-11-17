// =========================
// 🗃️ Utilidades de localStorage para persistir sesión
// =========================

import { STORAGE_KEYS } from "../constants";

// Verificar si localStorage está disponible
const isLocalStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

export const saveSessionData = (sessionId: string, roomCode: string, playerName: string) => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
        localStorage.setItem(STORAGE_KEYS.ROOM_CODE, roomCode);
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, playerName);
    } catch (error) {
        // Error silencioso
    }
};

export const getSessionData = () => {
    if (!isLocalStorageAvailable()) {
        return { sessionId: null, roomCode: null, playerName: null };
    }

    try {
        const data = {
            sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
            roomCode: localStorage.getItem(STORAGE_KEYS.ROOM_CODE),
            playerName: localStorage.getItem(STORAGE_KEYS.PLAYER_NAME),
        };

        return data;
    } catch (error) {
        return { sessionId: null, roomCode: null, playerName: null };
    }
};

export const clearSessionData = () => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
        localStorage.removeItem(STORAGE_KEYS.ROOM_CODE);
        localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
    } catch (error) {
        // Error silencioso
    }
};

