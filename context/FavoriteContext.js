import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteProducts');
        if (storedFavorites !== null) {
          setFavoriteProducts(JSON.parse(storedFavorites)); //lấy data trong AS lưu lại vào favoriteProducts
        }
      } catch (error) {
        console.log('Error loading favorites from AsyncStorage:', error);
      }
    };

    loadFavorites();
  }, []);

  const saveFavoritesToStorage = async (favorites) => {
    try {
      await AsyncStorage.setItem('favoriteProducts', JSON.stringify(favorites));
      console.log('Updated favorites in AsyncStorage:', favorites); 
    } catch (error) {
      console.log('Error saving favorites to AsyncStorage:', error);
    }
  };

  const addToFavorite = (product) => {
    const updatedFavorites = [...favoriteProducts, product];
    setFavoriteProducts(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites); 
  };

  const removeFromFavorite = (productId) => {
    const updatedFavorites = favoriteProducts.filter(item => item.id !== productId);
    setFavoriteProducts(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites); 
  };

  const removeMultipleFromFavorites = (productIds) => {
    const updatedFavorites = favoriteProducts.filter(item => !productIds.includes(item.id));
    setFavoriteProducts(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites); 
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteProducts,
        addToFavorite,
        removeFromFavorite,
        removeMultipleFromFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  return useContext(FavoriteContext);
};
