import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchProducts } from '../../services/productApi';
import { Colors } from '../../contrast/Colors';
import { useFavorite } from '../../context/FavoriteContext';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductScreen({ navigation }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { favoriteProducts, addToFavorite, removeFromFavorite } = useFavorite();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();

  useEffect(() => {
    const initializeProducts = async () => {
      let fetchedProducts = [];

      if (route.params?.initialProducts) {
        fetchedProducts = route.params.initialProducts;
        setFilteredProducts(fetchedProducts);
        setSearchQuery(route.params.initialSearchQuery || '');
      } else {
        fetchedProducts = await fetchProducts();
        setFilteredProducts(fetchedProducts);
      }

      const allProducts = await fetchProducts();
      const uniqueBrands = [...new Set(allProducts.map(product => product.brand))];
      setBrands(uniqueBrands);

      if (route.params?.selectedBrand) {
        setSelectedBrands([route.params.selectedBrand]);
      }
    };

    initializeProducts();
  }, [route.params?.initialProducts]);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    setLoading(true);


    const allProducts = await fetchProducts();
    const filtered = allProducts.filter(product =>
      product.artName.toLowerCase().includes(text.toLowerCase())
    );

    const finalFiltered = selectedBrands.length > 0
      ? filtered.filter(product => selectedBrands.includes(product.brand))
      : filtered;

    setFilteredProducts(finalFiltered);
    setLoading(false);
  };

  const applyFilter = async () => {
    setShowFilterModal(false);
    setLoading(true);

    await handleSearch(searchQuery);
    setLoading(false);
  };

  const toggleBrandSelection = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetBrands = () => {
    setSelectedBrands([]);  // Reset selected brands
  };

  const renderProductCard = ({ item }) => {
    const discount = Math.round(item.limitedTimeDeal * 100);
    const discountedPrice = (item.price * (1 - item.limitedTimeDeal)).toFixed(1);
    const isFavorite = favoriteProducts.some(fav => fav.id === item.id);

    const toggleFavorite = (item) => {
      const isFavorite = favoriteProducts.some(fav => fav.id === item.id);

      if (isFavorite) {
        removeFromFavorite(item.id);
        ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
      } else {
        addToFavorite(item);
        ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={2}>
          {item.artName}
        </Text>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
          {item.limitedTimeDeal > 0 && (
            <Text style={styles.originalPrice}>${item.price}</Text>
          )}
          {discount > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>${discountedPrice}</Text>
        </View>

        <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
          <Text style={{ color: isFavorite ? Colors.primary : Colors.light_grey }}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? Colors.primary : Colors.grey} />
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.black, Colors.light_grey]}
      start={{ x: 0.5, y: 0.15 }}
      end={{ x: 0.5, y: 0.000001 }}
      style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>
        <Searchbar
          style={{ backgroundColor: Colors.white, width: '75%' }}
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Ionicons name="filter-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        filteredProducts.length === 0 ? (
          <Text style={styles.noItemsText}>No items found</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.productList}
          />
        )
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Brands</Text>

            </View>

            <View style={{ marginBottom: 15 }}>
              {brands.map((brand, index) => (
                <View key={index} style={styles.checkboxContainer}>
                  <Checkbox
                    status={selectedBrands.includes(brand) ? 'checked' : 'unchecked'}
                    onPress={() => toggleBrandSelection(brand)}
                    color='black'
                  />
                  <Text style={styles.checkboxLabel}>{brand}</Text>
                </View>
              ))}
            </View>
            <View style={styles.filterAct}>
              <TouchableOpacity style={styles.resetButton} onPress={resetBrands}>
                <Text style={{ textAlign: 'center' }}><Ionicons name="refresh-sharp" size={20} color={Colors.tertiary} /></Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  backButton: {
    zIndex: 1,
  },
  card: {
    position: 'relative',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    width: '47%',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    color: Colors.black,
    marginVertical: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: 'PoppinsRegular',
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  discountedPrice: {
    fontSize: 24,
    fontFamily: 'PoppinsSemiBold',
    color: Colors.primary,
    alignItems: 'center'
  },
  discountTag: {
    backgroundColor: Colors.activePrimary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 10,
  },
  discountText: {
    fontSize: 10,
    color: Colors.white,
    fontFamily: 'PoppinsBold',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productList: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  noItemsText: {
    color: Colors.light_grey,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'PoppinsMedium'
  },
  filterAct: {
    flexDirection: 'row',
    marginVertical: 10
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginLeft: 2,
  },
  applyButtonText: {
    color: Colors.white,
    fontFamily: 'PoppinsSemiBold'
  },

  resetButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 2,
  }


});
