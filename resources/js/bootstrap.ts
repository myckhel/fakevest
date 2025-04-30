import axios from "axios";
window.axios = axios;

// Configure axios to work with Laravel session authentication
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
