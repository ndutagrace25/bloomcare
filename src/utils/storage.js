import AsyncStorage from '@react-native-community/async-storage';

export const addItemToStorage = async (key, item) => {
    try {
        await AsyncStorage.setItem(key, 'stored value')
    } catch (e) {
        return null;
    }
}

export const getItemFromStorge = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value;
        }
        return null;
    } catch (e) {
        return null;
    }
}