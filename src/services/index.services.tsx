import axios from "axios";

const authService = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api`
})

// configuring all outgoinf requests to include the token, in a secure way, as per the documentation of axios
authService.interceptors.request.use((config) => {
    const authToken = localStorage.getItem("authToken")

    if(authToken) {
        config.headers.authorization = `Bearer ${authToken}`
    }
    return config
})

export default authService