import axios from "axios";
import { getAccessToken } from "../store/profile.store";
import { Config } from "./config";

export const request = async (url = "", method = "GET", data = {}, headers = {}) => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (tokenExpiry && new Date() >= new Date(tokenExpiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        window.location.href = '/login';
        return;
    }
    try {
        var access_token = await getAccessToken();
        const response = await axios({
            url: Config.base_url + url,
            method,
            data: method !== "GET" ? data : {},
            headers: {
                "Content-Type": "application/json",
                ...headers,
                Authorization: `Bearer ${access_token}`,
            },
            params: method === "GET" ? data : {},
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
