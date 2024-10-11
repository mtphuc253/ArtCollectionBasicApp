import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { Colors } from '../../contrast/Colors';

export default function Profile() {
  const [name, setName] = useState('Mai Tấn Phúc');
  const [username, setUsername] = useState('MTP');

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://i.etsystatic.com/40274243/r/il/b583c7/4596581981/il_570xN.4596581981_21hx.jpg' }} 
        style={styles.avatar} 
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#999"
        />
      </View>
      <Text style={styles.itemCount}>
        Item in Collection: <Text style={styles.italicText}> 9</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 80,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    alignSelf: 'center', 
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    color: '#fff',
  },
  itemCount: {
    color: '#fff',
    fontSize: 22,
    marginTop: 30,
    textAlign: 'left',
    fontFamily: "PoppinsBold"
  },
  italicText: {
    fontFamily: "PoppinsBoldItalic",
    marginLeft: 15,
    fontSize: 24,
    color: Colors.primary
  },
});
