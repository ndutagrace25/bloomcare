import axios from 'axios';

// axios.defaults.baseURL = 'https://tambuzi-backend.bloomcare.net';
axios.defaults.baseURL = 'https://pendekeza-backend.bloomcare.net';
// axios.defaults.baseURL = 'https://demo-backend.bloomcare.net';
// axios.defaults.baseURL = 'https://tambuzi-backend.bloomcare.net';
// axios.defaults.baseURL = 'https://test-backend.bloomcare.net';
// axios.defaults.baseURL = "http://169.239.171.102:8084/";
// axios.defaults.baseURL = "http://localhost:5000";

// axios.interceptors.request.use(request => {
//     console.log('Starting Request', request);
//     return request;
// });

// axios.interceptors.response.use(response => {
//     console.log('Response:', response);
//     return response;
// });

export default axios;