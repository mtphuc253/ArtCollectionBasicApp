import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, ToastAndroid } from 'react-native';
import { Colors } from './../../contrast/Colors';
import { fetchProducts } from './../../services/productApi';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFavorite } from '../../context/FavoriteContext';
import { Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { favoriteProducts, addToFavorite, removeFromFavorite } = useFavorite();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
      setBrands(getUniqueBrands(data));
      setLoading(false);
    };
    loadProducts();
  }, []);

  const getUniqueBrands = (data) => {
    const brandsSet = new Set(data.map(item => item.brand));
    return Array.from(brandsSet);
  };

  const handleBrandPress = (brand) => {
    const filteredProducts = products.filter(product => product.brand === brand);
    navigation.navigate('ProductScreen', { initialProducts: filteredProducts, selectedBrand: brand, });
  };

  const handleSearch = () => {
    const filtered = products.filter(product =>
      product.artName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchQuery('');
    navigation.navigate('ProductScreen', {
      initialProducts: filtered,
      initialSearchQuery: searchQuery
    });
  };

  const handleFavorite = (product) => {
    if (favoriteProducts.find(fav => fav.id === product.id)) {
      removeFromFavorite(product.id);
      ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
    } else {
      addToFavorite(product);
      ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
    }
  };

  const renderProductCard = ({ item }) => {
    const isFavorite = favoriteProducts.find(fav => fav.id === item.id) !== undefined;
    const discountedPrice = item.price * (1 - item.limitedTimeDeal);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={{ width: '100%', backgroundColor: '#fff', padding: 10, alignItems: 'center', borderRadius: 10 }}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>

        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite ? styles.favoriteButtonActive : null]}
          onPress={() => handleFavorite(item)}
        >
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? Colors.primary : Colors.grey} />
        </TouchableOpacity>

        <Text style={styles.productName} numberOfLines={2}>
          {item.artName}
        </Text>

        {/* <View style={styles.priceContainer}>
          {item.limitedTimeDeal > 0 ? (
            <View style={styles.priceContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.discountedPrice}>${discountedPrice.toFixed(2)}</Text>
                <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
              </View>

              <View style={styles.discountTag}>
                <Text style={styles.discountText}>
                  -{Math.round(item.limitedTimeDeal * 100)}%
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.discountedPrice}>${item.price.toFixed(2)}</Text>
          )}
        </View> */}
      </TouchableOpacity>
    );
  };



  const renderBrandCard = ({ item }) => {
    let backgroundImage = '';
    switch (item) {
      case 'Color Splash':
        backgroundImage = 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/colors-splash-logo-design-template-ef0a5aa7477835d7b948657bc9473748_screen.jpg?ts=1698161567';
        break;
      case 'Edding':
        backgroundImage = 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052018/untitled-1_26.png?YfOug.qHtJwFMeTjXrA3RhoqWspHvZt6&itok=bDLSbi5Q';
        break;
      case 'Arteza':
        backgroundImage = 'https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/8/AmazonStores/ATVPDKIKX0DER/091a511f8110eb93c5c7cc331ae47619.w2100.h2100._RO1049,1,0,0,0,0,0,0,0,0,15_FMpng_.jpg';
        break;
      case 'KingArt':
        backgroundImage = 'https://www.facepaintshop.eu/media/attribute/swatch/KingArt-Logo-Updated_380x.jpg';
        break;
      default:
        backgroundImage = 'https://via.placeholder.com/150';
    }

    return (
      <TouchableOpacity
        style={styles.brandContainer}
        onPress={() => handleBrandPress(item)}
      >
        <View style={styles.brandCard}>
          <Image source={{ uri: backgroundImage }} style={styles.brandImage} />
        </View>
        <Text style={styles.brandName}>{item}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.black, Colors.light_grey]}
      start={{ x: 0.5, y: 0.15 }}
      end={{ x: 0.5, y: 0.000001 }}
      style={{ flex: 1, paddingBottom: 80 }}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTitle}>
            <Text style={{ fontSize: 20, color: Colors.white, textAlign: 'center', marginRight: 5, fontFamily: 'PoppinsBoldItalic' }}>
              Welcome
            </Text>

            <Text style={{ fontSize: 24, color: Colors.primary, textAlign: 'center', alignItems: 'center', fontFamily: 'PoppinsLight' }}>
              to US
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.discovery}>
        <View style={styles.discoveryTitle}>
          <Text style={{
            fontSize: 28,
            textAlign: 'left',
            alignContent: 'flex-start',
            color: Colors.white,
            fontFamily: 'PoppinsBold'

          }}>
            Have a
          </Text>
          <Text style={{
            fontSize: 36,
            textAlign: 'left',
            alignContent: 'flex-start',
            color: Colors.primary,
            marginBottom: 10,
            fontFamily: 'PoppinsBoldItalic'
          }}>

            Good day!
          </Text>
        </View>

        <Searchbar
          style={{ backgroundColor: Colors.white }}
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      <View style={styles.brandSection}>
        {/* <Text style={styles.sectionTitle}>Brands</Text> */}
        <FlatList
          data={brands}
          renderItem={renderBrandCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandList}
        />
      </View>

      <View style={styles.brandSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={styles.colectionTitle}>Collection</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { initialProducts: products })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 15 }}>
              <Text style={styles.seeAllButton}>See all</Text>
              <AntDesign name="arrowright" size={18} color="#ededed" />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      </View>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.background.black,
    padding: 10,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  headerTitle: {
    textAlign: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  filterButton: {
    position: 'absolute',
    right: 5,
    padding: 10,
  },

  productDisplay: {
    padding: 10,
    paddingTop: 30,
  },
  discovery: {
    backgroundColor: Colors.background.black,
    flexDirection: 'column',
    marginTop: 10,
    marginHorizontal: 30
  },
  discoveryTitle: {
    marginTop: 0,
    justifyContent: 'flex-start',
  },
  discoveryTitleText: {
    fontSize: 20,
    textAlign: 'left',
    alignContent: 'flex-start',
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,

  },

  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  brandSection: {
    paddingLeft: 30,
    marginVertical: 5,
    marginBottom: 0,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: Colors.primary,
    marginRight: 10,
    marginBottom: 15,
  },
  colectionTitle: {
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    color: Colors.primary,
    marginRight: 10,

  },
  seeAllButton: {
    fontSize: 16,
    color: "#ededed",
    // fontWeight: '500',
    // fontStyle: 'italic',
    fontFamily: 'PoppinsLightItalic',
    alignItems: 'center',
    marginRight: 10
  },
  brandList: {
    paddingBottom: 10,
    marginTop: 10,

  },
  brandCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    height: 84,
    width: 84,
  },
  brandImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    borderRadius: 6,
  },
  brandName: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
    color: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    justifyContent: 'center',

  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: Colors.background.black,
    borderRadius: 5,
    paddingRight: 10,
    marginHorizontal: 0,
    width: 220,
    alignItems: 'center',
  },
  productImage: {
    width: 160,
    height: 240,
    resizeMode: 'contain',
    borderRadius: 5,
    padding: 10
  },
  productName: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    marginTop: 10,
    color: Colors.white,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light_grey,
    textDecorationLine: 'line-through',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 15
  },
  priceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginRight: 5
  },
  discountTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  discountText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },

  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.white,
    borderRadius: 20,

  },
});
