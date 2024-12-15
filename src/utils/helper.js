import axios from "axios";
import { Config } from "./config";

export const request = async (url = "", method = "GET", data = {}, headers = {}) => {
    try {
        const response = await axios({
            url: Config.base_url + url,
            method,
            data: method !== "GET" ? data : {}, // Include `data` only for non-GET requests
            headers: {
                "Content-Type": "application/json",
                ...headers, // Allow additional headers to be passed
            },
            params: method === "GET" ? data : {}, // Use `params` for GET requests
        });
        return response.data;
    } catch (error) {
        console.error("API Request Error:", error.response || error.message);
        // Return error response to handle gracefully in the caller
        throw error.response ? error.response.data : error;
    }
};
