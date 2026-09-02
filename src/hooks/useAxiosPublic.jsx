import axios from "axios";

// Set VITE_API_BASE_URL in your .env (local) and in Vercel's project
// settings (production) — e.g. http://localhost:9000 locally,
// https://your-backend.vercel.app once deployed.
const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;