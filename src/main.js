import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios';
import router from '../router';

axios.defaults.baseURL = "http://localhost:3000";

createApp(App).use(router).mount('#app')
