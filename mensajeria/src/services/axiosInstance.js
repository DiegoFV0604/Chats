// axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.83:8000/api/', // Asegúrate de que esta URL sea correcta
});

// Aquí puedes obtener el token del almacenamiento (ej. AsyncStorage)
const getToken = async () => {
    return await AsyncStorage.getItem('access_token'); // Ajusta el nombre del token si es necesario
};

// Agrega el token al encabezado de las solicitudes
axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
