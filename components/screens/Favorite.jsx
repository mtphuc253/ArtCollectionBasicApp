import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated, Image } from 'react-native';
import { useFavorite } from '../../context/FavoriteContext';
import { Checkbox } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../contrast/Colors';

const Favorite = () => {
  const { favoriteProducts, removeFromFavorite, removeMultipleFromFavorites } = useFavorite();
  const [selectedItems, setSelectedItems] = useState({});
  const [showCheckboxes, setShowCheckboxes] = useState(true);
  const swipeableRowRefs = useRef({});
  const navigation = useNavigation();

  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const toggleCheckbox = (id) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleRemoveSelected = () => {
    const selectedProductIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id] === true
    );

    if (selectedProductIds.length === 0) {
      Alert.alert("No products selected", "Please select products to remove.");
      return;
    }

    Alert.alert(
      "Delete Selected Products",
      "Are you sure you want to delete the selected products?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            removeMultipleFromFavorites(selectedProductIds);
            setSelectedItems({});
          },
        },
      ]
    );
  };

  const handleRemoveSingleProduct = (productId) => {
    Alert.alert(
      "Remove Product",
      "Are you sure you want to remove this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removeFromFavorite(productId) }
      ]
    );
  };

  const toggleAllCheckboxes = () => {
    const allChecked = favoriteProducts.every(item => selectedItems[item.id]);

    const newSelectedItems = {};
    favoriteProducts.forEach(item => {
      newSelectedItems[item.id] = !allChecked;
    });

    setSelectedItems(newSelectedItems);
  };

  const renderRightActions = (progress, dragX, productId) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => handleRemoveSingleProduct(productId)}>
        <Animated.View style={[styles.rightAction, { transform: [{ translateX: trans }] }]}>
          <Entypo name="cross" size={24} style={styles.actionText} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item }) => (
    <Swipeable
      ref={(ref) => (swipeableRowRefs.current[item.id] = ref)}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.id)
      }
    >
      <TouchableOpacity onPress={() => navigateToProductDetail(item)}>
        <View style={styles.productCard}>
          {showCheckboxes && (
            <Checkbox
              status={selectedItems[item.id] ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckbox(item.id)}
              color={Colors.black}
            />
          )}
          <View style={styles.productCardInfor}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.artName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite</Text>
      </View>

      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No item</Text>
        </View>
      ) : (
        <>
          {showCheckboxes && (
            <View style={styles.actionBtns}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={
                    favoriteProducts.every(item => selectedItems[item.id])
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={toggleAllCheckboxes}
                  color={Colors.black}
                />
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.allSelectText}>All</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleRemoveSelected}>
                <Feather name="trash" size={24} style={styles.deleteText} />
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={favoriteProducts.slice().reverse()}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PoppinsBold"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: Colors.light_grey,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 15,
  },
  allSelectText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 16
  },

  productCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 10,
  },
  productCardInfor: {
    padding: 20,
    paddingRight: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 8,
  },
  productName: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    flexShrink: 1,
    marginLeft: 8, 
  },
  rightAction: {
    alignItems: 'flex-end',
    backgroundColor: Colors.tertiary,
    flex: 1,
    marginBottom: 8,
    justifyContent: 'center',
    paddingRight: 0,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  allText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#FF0000',
    marginRight: 10,
  },
});

export default Favorite;
