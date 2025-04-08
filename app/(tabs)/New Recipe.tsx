import { TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/context/RecipeContext';

export default function NewRecipe() {
  const [, setGalleryPermission] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const { addRecipe } = useRecipes();

  const permisionFunction = async () => {
    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    setGalleryPermission(imagePermission.status === 'granted');
    if (imagePermission.status !== 'granted') {
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddRecipe = () => {
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return;
    }

    addRecipe({
      name: recipeName,
      description,
      imageUri,
    } as Recipe);

    setRecipeName('');
    setDescription('');
    setImageUri('');
  };

  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>Add a New Recipe</Text>
      <TextInput
        placeholder="Recipe Name"
        style={styles.input}
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, styles.inputDescription]}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
      <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
        <Text>Add Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  inputDescription: {
    height: 100,
    textAlignVertical: 'top',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
