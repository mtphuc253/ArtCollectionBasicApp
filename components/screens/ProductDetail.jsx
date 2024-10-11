import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, ToastAndroid } from 'react-native';
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../contrast/Colors';
import { useFavorite } from '../../context/FavoriteContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Menu, PaperProvider } from 'react-native-paper';

export default function ProductDetail({ route, navigation }) {
  const { product } = route.params;
  const { favoriteProducts, addToFavorite, removeFromFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(product.interact.comment || []);
  const [likes, setLikes] = useState(product.interact.like);
  const [shares, setShares] = useState(product.interact.share);

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigateToHome = () => {
    closeMenu();
    navigation.navigate('Home');
  };

  const navigateToFavorite = () => {
    closeMenu();
    navigation.navigate('Favorite');
  };

  useEffect(() => {
    const isProductFavorite = favoriteProducts.some(fav => fav.id === product.id);
    setIsFavorite(isProductFavorite);
  }, [favoriteProducts, product.id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorite(product.id);
      ToastAndroid.show('Removed from Favorites', ToastAndroid.SHORT);
    } else {
      addToFavorite(product);
      ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
    }
    setIsFavorite(!isFavorite);
  };

  const toggleLike = () => {
    setLikes((prev) => (isLiked ? prev + 1 : prev - 1));
    setIsLiked(!isLiked);
  };

  const toggleShare = () => {
    setShares((prev) => prev + 1);
  };

  const addComment = () => {
    if (newComment.trim() !== "") {
      const comment = {
        username: "MTP",
        commentContent: newComment,
        commentLike: 0,
        isLiked: false,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const toggleCommentLike = (index) => {
    const updatedComments = [...comments];
    if (!updatedComments[index].isLiked) {
      updatedComments[index].commentLike += 1;
    } else {
      updatedComments[index].commentLike -= 1;
    }
    updatedComments[index].isLiked = !updatedComments[index].isLiked;
    setComments(updatedComments);
  };

  const discountedPrice = product.price - product.price * product.limitedTimeDeal;
  const discountPercentage = Math.round(product.limitedTimeDeal * 100);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.topRightButtons}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={32}
              color={isFavorite ? Colors.primary : Colors.light_grey}
            />
          </TouchableOpacity>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                <Feather name="more-vertical" size={28} color={Colors.grey} />
              </TouchableOpacity>
            }>
            <Menu.Item onPress={navigateToHome} title="Home" />
            <Menu.Item onPress={navigateToFavorite} title="Favorite" />
          </Menu>
        </View>

        <View style={styles.productImageView}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <LinearGradient
          colors={[Colors.black, Colors.white]}
          start={{ x: 0.5, y: 0.9 }}

          style={styles.productInfor}>
          <View style={styles.likesCommentsContainer}>
            <Text style={styles.likeCount}>{likes} <AntDesign name="like1" size={18} color="white" /></Text>
            <TouchableOpacity onPress={() => setShowCommentsModal(true)}>
              <Text style={styles.commentCount}>{comments.length} {comments.length === 1 ? "comment" : "comments"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.interactButtonsContainer}>
            <View style={styles.interactButtons}>
              <TouchableOpacity onPress={toggleLike} style={styles.interactButton}>
                <AntDesign name={isLiked ? "like2" : "like1"} size={24} color={isLiked ? "white" : Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowCommentsModal(true)} style={styles.interactButton}>
                <Ionicons name="chatbubble-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleShare} style={styles.interactButton}>
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.artName}</Text>
          </View>

          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productBrand}><Text style={{ fontWeight: 'bold', color: Colors.white, fontFamily: 'PoppinsBold' }}>
            <Text style={{ color: Colors.white, fontFamily: 'PoppinsBold', }}>
              Brand:
            </Text>
          </Text> {product.brand}</Text>
          <Text style={styles.productGlassSurface}>Glass Surface: {product.glassSurface ? <AntDesign name="checkcircleo" size={18} color="white" /> : <Entypo name="squared-cross" size={20} color="white" />}</Text>

          <View style={styles.priceContainer}>
            {discountPercentage > 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text style={styles.originalPrice}>${product.price}</Text>
                <Text style={styles.discountTag}>-{discountPercentage}%</Text>
              </View>
            ) : null}

            <Text style={styles.discountedPrice}>
              ${discountedPrice.toFixed(1)}
            </Text>
          </View>

        </LinearGradient>

        <Modal visible={showCommentsModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              <FlatList
                data={comments}
                renderItem={({ item, index }) => (
                  <View style={styles.commentContainer}>
                    <Text style={styles.commentUsername}>{item.username}</Text>
                    <View style={styles.commentContent}>
                      <View style={{ width: '80%' }}>
                        <Text style={styles.commentText}>{item.commentContent}</Text>
                      </View>
                      <View style={styles.commentLikesContainer}>
                        <Text style={styles.commentLikes}>{item.commentLike}</Text>
                        <TouchableOpacity onPress={() => toggleCommentLike(index)}>
                          <AntDesign name={item.isLiked ? "like1" : "like2"} size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={addComment} style={styles.addCommentButton}>
                  <Ionicons name="send-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: Colors.white,
  },
  toggleFavorite: {
    marginRight: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  topRightButtons: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    zIndex: 1,
  },
  menuButton: {
    marginLeft: 10,
  },
  productImageView: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  likesCommentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
  },
  likeCount: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: Colors.white,
  },
  commentCount: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    color: Colors.white,
  },
  productInfor: {
    height: '100%',
    padding: 30,
    borderRadius: 50,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  productName: {
    fontSize: 22,
    fontFamily: 'PoppinsBold',
    marginTop: 20,
    marginBottom: 0,
    color: Colors.white,
  },
  priceContainer: {
    marginTop: 30,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.white,
    textDecorationLine: 'line-through',
    fontFamily: 'PoppinsMedium',
    marginRight: 10,
  },
  discountTag: {
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    fontSize: 12,
    color: '#ededed',
    fontWeight: 'bold',
  },
  discountedPrice: {
    fontSize: 42,
    fontFamily: 'PoppinsSemiBold',
    color: Colors.secondary,
  },
  productDescription: {
    fontSize: 18,
    fontFamily: 'PoppinsMediumItalic',
    marginTop: 5,
    marginBottom: 25,
    color: Colors.light_grey,
  },
  productBrand: {
    fontSize: 18,
    fontFamily: 'PoppinsBoldItalic',
    marginBottom: 0,
    color: Colors.light_grey,
  },
  productGlassSurface: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    marginBottom: 5,
    color: Colors.white,
  },
  interactButtonsContainer: {
    width: '100%',
    marginTop: 5,
    marginLeft: 5
  },
  interactButtons: {
    width: '33%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  interactButton: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: 'PoppinsBold',
    marginBottom: 0,
    textAlign: 'center',

  },
  modalContent: {
    position: 'relative',
    width: '100%',
    height: '90%',
    padding: 20,
    backgroundColor: Colors.black,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20
  },
  commentContainer: {

    marginVertical: 12,
    padding: 5

  },
  commentUsername: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'PoppinsBold',
    marginBottom: 3,
  },
  commentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentText: {
    color: "#ededed",
    fontSize: 15,
  },
  commentLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikes: {
    color: Colors.white,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light_grey,
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: Colors.light_grey,
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  addCommentButton: {
    color: Colors.white,
    padding: 10,
    marginLeft: 10,
  },
});
