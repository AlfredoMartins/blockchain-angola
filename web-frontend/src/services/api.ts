import axios from "axios";
import { GLOBAL_VARIABLES, TOKEN_KEY } from '@/global/globalVariables';
import { getItemAsync } from "@/context/SecureStore";

const API_URL = `http://${GLOBAL_VARIABLES.LOCALHOST}/api`;

export const api = axios.create({
  baseURL: API_URL
});

export const api_private = async () => {
  const token = await getItemAsync(TOKEN_KEY);

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return axios.create({
    baseURL: API_URL,
    withCredentials: true
  });
}