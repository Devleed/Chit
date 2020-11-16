import axios from 'axios';

export default axios.create({
  // baseURL: 'https://enigmatic-gorge-88521.herokuapp.com/',
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});
