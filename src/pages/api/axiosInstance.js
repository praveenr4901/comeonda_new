
import axios from 'axios';
  /* istanbul ignore next */
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
//   withCredentials: true,
});

export default axiosInstance;