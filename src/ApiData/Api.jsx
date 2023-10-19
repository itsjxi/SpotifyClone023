import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1'; // You can change this base URL as needed

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found in local storage');
  }
  return token;
};

export const fetchData = async (endpoint) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};
