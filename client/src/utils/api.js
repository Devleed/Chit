import axios from 'axios';

export default axios.create({
  baseURL: 'https://enigmatic-gorge-88521.herokuapp.com/',
  headers: {
    'Content-Type': 'application/json'
  }
});
