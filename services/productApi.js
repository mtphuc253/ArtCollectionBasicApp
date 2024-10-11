import axios from 'axios';

const API_URL = 'https://66f515099aa4891f2a23c71b.mockapi.io/color';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};
