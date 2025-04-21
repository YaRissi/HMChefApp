import { TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/context/RecipeContext';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { tintColorLight } from '@/constants/Colors';
import AppInput from '@/components/AppInput';

export default function NewRecipeScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>(
    {} as ImagePicker.ImagePickerAsset,
  );
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [allcategories, setAllCategories] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState('');
  const { addRecipe } = useRecipes();

  const [isFocus, setIsFocus] = useState(false);

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
      .catch(() => {
        Alert.alert('Error', 'Failed to fetch categories.');
      });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleAddRecipe = async () => {
    if (!recipeName.trim() || !description.trim() || !image.uri || !category) {
      Alert.alert(
        'Error',
        'Please enter a recipe name, description, select an image, and choose a category',
      );
      return;
    }

    try {
      addRecipe(
        {
          name: recipeName,
          description,
          imageUri: image.uri,
          category,
        } as Recipe,
        image,
      );

      setRecipeName('');
      setDescription('');
      setImage({} as ImagePicker.ImagePickerAsset);
      setCategory('');
    } catch {
      Alert.alert('Error', 'The recipe could not be added. Please try again.');
    }
  };

  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>Add a New Recipe</Text>
      <AppInput
        input={recipeName}
        placeholder="Recipe Name"
        iconName="drive-file-rename-outline"
        iconPack="MaterialIcons"
        setInput={setRecipeName}
        returnKeyType="next"
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={[styles.placeholder, styles.text]}
        selectedTextStyle={styles.text}
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
      {image.uri && <Image source={{ uri: image.uri }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
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
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: tintColorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    height: 45,
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 13,
  },
  text: {
    fontSize: 16,
  },
  placeholder: {
    color: 'gray',
  },
});
