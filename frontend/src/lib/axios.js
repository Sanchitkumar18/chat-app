import axios from "axios"

export const axiosInstance = axios.create(
    {
        baseURL: "http:/localhost5001/api",
        withCredentials: true
    }
)