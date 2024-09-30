import axios from "axios";


const BASE_URL = "http://localhost:4003/api" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance;   