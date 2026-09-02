import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'
})

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (err) {
        return Promise.reject(err);
    })

    axiosSecure.interceptors.response.use(function (res) {
        return res;
    }, async err => {
        const status = err.response.status;
        if (status === 401 || status === 403) {
            await logOut();
            navigate('/signIn');
        }
    })
    return axiosSecure;
};

export default useAxiosSecure;