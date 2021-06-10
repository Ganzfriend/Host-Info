import axios from 'axios';

const getData = () => (
  Promise.all([
    axios.get('/location/Austin'),
    axios.get('/hostInfo/Jon-Lasley'),
    axios.get('/toKnow/Model-H-is-for-house'),
  ])
);

export default getData;
