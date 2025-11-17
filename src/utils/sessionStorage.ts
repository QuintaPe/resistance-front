// =========================
// 🗃️ Utilidades de localStorage para persistir sesión
// =========================

const STORAGE_KEYS = {
    SESSION_ID: "resistance_sessionId",
    ROOM_CODE: "resistance_roomCode",
    PLAYER_NAME: "resistance_playerName",
};

// Verificar si localStorage está disponible
const isLocalStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('❌ localStorage no está disponible:', e);
        return false;
    }
};

export const saveSessionData = (sessionId: string, roomCode: string, playerName: string) => {
    if (!isLocalStorageAvailable()) {
        console.error('❌ No se puede guardar - localStorage no disponible');
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
        localStorage.setItem(STORAGE_KEYS.ROOM_CODE, roomCode);
        localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, playerName);

        console.log('💾 Sesión GUARDADA en localStorage:', {
            sessionId: sessionId.substring(0, 15) + '...',
            roomCode,
            playerName,
            timestamp: new Date().toISOString()
        });

        // Verificar que realmente se guardó
        const saved = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (!saved) {
            console.error('⚠️ ADVERTENCIA: Los datos NO se guardaron en localStorage');
        }
    } catch (error) {
        console.error('❌ Error guardando en localStorage:', error);
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

        if (data.sessionId) {
            console.log('📂 Sesión RECUPERADA de localStorage:', {
                sessionId: data.sessionId.substring(0, 15) + '...',
                roomCode: data.roomCode,
                playerName: data.playerName,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log('📭 No hay sesión guardada en localStorage');
        }

        return data;
    } catch (error) {
        console.error('❌ Error leyendo localStorage:', error);
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

        console.log('🗑️ Sesión BORRADA de localStorage:', {
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error limpiando localStorage:', error);
    }
};

