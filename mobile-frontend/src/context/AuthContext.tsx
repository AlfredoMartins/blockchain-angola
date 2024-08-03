import { createContext, useContext, useEffect, useState } from "react";
import axios from "src/api/axios";
import * as SecureStore from 'expo-secure-store';
import { HashMap } from "src/data_types";

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null, email: string | null, electoralId?: string | null, port?: string | null};
    onLogin?: (electoralId: string, password: string) => Promise<any>,
    isLoggedIn?: () => Promise<any>,
    onRegister?: (electoralId: string, password: string) => Promise<any>,
    onLogOut?: () => Promise<any>,
    imageList: HashMap<any>,
    setImageList: (imageList: HashMap<any> | undefined) => void
}

export const TOKEN_KEY = 'my-jwt';
export const TOKEN_EMAIL = 'my-email';
export const TOKEN_ELECTORAL_ID = 'my-electoral-id';
export const TOKEN_PORT = 'my-port';

export const LOCALHOST = 'http://192.168.0.38:';
export const PORT = '3010';
export const API_URL = LOCALHOST + PORT;

const LOGIN_URL = '/committee/auth-mobile';
const REGISTER_URL = '/committee/register-voter';
const REFRESH_URL = '/committee/refresh-token';

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated: boolean | null,
        email: string | null,
        electoralId?: string | null,
        port?: string | null,
    }>({
        token: null,
        authenticated: null,
        email: null,
        electoralId: null,
        port: null,
    })

    const [imageList, setImageList] = useState<HashMap<any>>();

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const email = await SecureStore.getItemAsync(TOKEN_EMAIL);
            const electoralId = await SecureStore.getItemAsync(TOKEN_ELECTORAL_ID);
            const port = await SecureStore.getItemAsync(TOKEN_PORT);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                axios.defaults.headers.common['Cookie'] = `jwt=${token}`;

                setAuthState({
                    token: token,
                    authenticated: true,
                    email: email,
                    electoralId: electoralId,
                    port: port,
                })
            }
        }

        loadToken();
    }, [])

    const register = async (body: any) => {
        try {
            return await axios.post(REGISTER_URL, body);
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg }
        }
    };

    const login = async (electoralId: string, password: string) => {
        try {
            const result = await axios.post(LOGIN_URL, {
                electoralId: electoralId,
                password: password
            });

            setAuthState({
                token: result.data.accessToken,
                authenticated: true,
                email: result.data.email,
                electoralId: electoralId,
                port: result.data.port,
            });

            // console.log("PORT: ", result.data.port);

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
            axios.defaults.headers.common['Cookie'] = `jwt=${result.data.accessToken}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
            await SecureStore.setItemAsync(TOKEN_EMAIL, result.data.email);
            await SecureStore.setItemAsync(TOKEN_ELECTORAL_ID, electoralId);
            await SecureStore.setItemAsync(TOKEN_PORT, result.data.port);

            return result;
        } catch (e) {
            return { error: true, msg: e };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(TOKEN_EMAIL);
        await SecureStore.deleteItemAsync(TOKEN_ELECTORAL_ID);
        await SecureStore.deleteItemAsync(TOKEN_PORT);

        axios.defaults.headers.common['Authorization'] = '';
        axios.defaults.headers.common['Cookie'] = '';

        setAuthState({
            token: null,
            authenticated: false,
            email: "",
            electoralId: "",
            port: "",
        })
    };

    const isLoggedIn = async () => {
        try {
            if (!axios.defaults.headers.common['Authorization']) {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['Cookie'] = `jwt=${token}`;
                }
            }

            const response = await axios.get(REFRESH_URL, {
                withCredentials: true
            });

            const statusCode = response.status;

            if (statusCode === 200) {

                const token = response.data.accessToken;
                setAuthState({
                    token: token,
                    authenticated: true,
                    email: ""
                })

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                return response;
            } else {
                await logout();
            }

            return null;
        } catch (e) {
            return { error: true, msg: e };
        }
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogOut: logout,
        isLoggedIn: isLoggedIn,
        authState,
        imageList,
        setImageList
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}