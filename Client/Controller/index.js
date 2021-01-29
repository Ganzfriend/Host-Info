import axios from 'axios';

const getData = () => (
  Promise.all([
    axios.get('http://3.101.149.145:3001/location/Austin'),
    axios.get('http://3.101.149.145:3001/hostInfo/Jon-Lasley'),
    axios.get('http://3.101.149.145:3001/toKnow/Model-H-is-for-house'),
  ])
);

export default getData;
