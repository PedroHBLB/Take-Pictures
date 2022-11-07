import axios from 'axios';

export default axios.create({
    baseURL: 'http://192.168.11.105:4500'
})