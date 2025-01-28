import axios from "axios";
import { getAccessToken } from "../store/profile.store";
import { Config } from "../utils/config";

export const request = async (url = "", method = "GET", data = {}, headers = {}) => {
    if (!isTokenValid()) {
        handleTokenExpiration();
        return;
    }

    try {
        const access_token = await getAccessToken();
        const isFormData = data instanceof FormData;
        
        const config = {
            url: Config.base_url + url,
            method,
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                Authorization: `Bearer ${access_token}`,
                ...headers
            },
            ...(method === "GET" ? { params: data } : { data }),
            ...(isFormData && { transformRequest: [(data) => data] })
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        logError(url, method, error);
        throw error.response?.data || error;
    }
};

const isTokenValid = () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    return !(tokenExpiry && new Date() >= new Date(tokenExpiry));
};

const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
};

const logError = (url, method, error) => {
    console.error('Request error:', {
        url,
        method,
        error: error.response?.data || error.message,
        status: error.response?.status
    });
};