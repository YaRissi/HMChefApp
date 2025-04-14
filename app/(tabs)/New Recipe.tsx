import { TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/context/RecipeContext';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function NewRecipeScreen() {
  const [, setGalleryPermission] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [allcategories, setAllCategories] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState('');
  const { addRecipe, allrecipes } = useRecipes();

  const [isFocus, setIsFocus] = useState(false);

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

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(response => response.json())
      .then(data => {
        const categories = [];
        for (const category of data.categories) {
          const categoryData = {
            label: category.strCategory,
            value: category.strCategory,
          };
          categories.push(categoryData);
        }
        setAllCategories(categories);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddRecipe = () => {
    if (!recipeName.trim() || !description.trim() || !imageUri || !category) {
      Alert.alert(
        'Error',
        'Please enter a recipe name, description, select an image, and choose a category',
      );
      return;
    }

    addRecipe({
      name: recipeName,
      description,
      imageUri,
      category,
    } as Recipe);

    setRecipeName('');
    setDescription('');
    setImageUri('');
    setCategory('');
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
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={allcategories}
        search
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Category' : '...'}
        value={category}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setCategory(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <MaterialIcons style={styles.icon} size={20} color={'black'} name="fastfood" />
        )}
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
  dropdown: {
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    color: 'gray',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
