import { getDatabase, ref, get, set, remove } from 'firebase/database';

const db = getDatabase();

export const getUserLocalities = async (userId) => {
    try {
        const userRef = ref(db, `users/${userId}/localities`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            return []; // Return empty array if no localities are found
        }

        const localitiesData = snapshot.val();
        return Object.keys(localitiesData); // Return localities as an array of keys
    } catch (error) {
        console.error('Error getting localities:', error);
        throw error;
    }
};
export const setUserData = async (userId, userData) => {
    try {
        const userRef = ref(db, `users/${userId}/data`);
        await set(userRef, userData);
    } catch (error) {
        console.error('Error setting user data:', error);
        throw error;
    }
};

export const addLocation = async (userId, location) => {
    try {
        const locationRef = ref(db, `users/${userId}/localities/${location}`);
        await set(locationRef, true);
    } catch (error) {
        console.error('Error adding location:', error);
        throw error;
    }
};

export const removeLocation = async (userId, location) => {
    try {
        const locationRef = ref(db, `users/${userId}/localities/${location}`);
        await remove(locationRef);
    } catch (error) {
        console.error('Error removing location:', error);
        throw error;
    }
};
