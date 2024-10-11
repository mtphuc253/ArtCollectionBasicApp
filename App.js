import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Feather } from '@expo/vector-icons';
import { FavoriteProvider } from './context/FavoriteContext';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import Home from './components/screens/Home';
import Favorite from './components/screens/Favorite';
import ProductDetail from './components/screens/ProductDetail';
import ProductScreen from './components/screens/ProductScreen';
import { Colors } from './contrast/Colors';
import { useFonts } from 'expo-font';
import Profile from './components/screens/Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Home} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={Favorite}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            
            <Feather name="user" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={HomeStack} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
    </Stack.Navigator>
  );
}

export default function App() {

  const [fontsLoaded] = useFonts({
    PoppinsExtraLight: require('./assets/fonts/Poppins-ExtraLight.ttf'),
    PoppinsLight: require('./assets/fonts/Poppins-Light.ttf'),
    PoppinsLightItalic: require('./assets/fonts/Poppins-LightItalic.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins-Medium.ttf'),
    PoppinsMediumItalic: require('./assets/fonts/Poppins-MediumItalic.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsSemiBoldItalic: require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    PoppinsBoldItalic: require('./assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsExtraBold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsExtraBoldItalic: require('./assets/fonts/Poppins-ExtraBoldItalic.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoriteProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </FavoriteProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    marginBottom: 15,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    marginHorizontal: 10,

  },
});
