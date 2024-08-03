/* eslint-disable @typescript-eslint/no-explicit-any */
import * as CryptoJS from 'crypto-js';

const SECRET_KEY_TOKEN: string = import.meta.env.SECRET_KEY_TOKEN ?? "";

const setItemAsync = async (key: string, value: string) => {
    const encryptedData = CryptoJS.AES.encrypt(value, SECRET_KEY_TOKEN).toString();
    await sessionStorage.setItem(key, encryptedData);
}

const deleteItemAsync = async (key: string) => {
    await sessionStorage.removeItem(key);
}

const getItemAsync = async (key: string): Promise<string | null> => {
    const value = sessionStorage.getItem(key);
    if (value === null) return null; // Return null if item not found

    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY_TOKEN);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

export {
    setItemAsync,
    deleteItemAsync,
    getItemAsync
};