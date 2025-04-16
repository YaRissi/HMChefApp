import { StyleSheet, TextInput, Alert } from 'react-native';

import { View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Recipes from '@/components/Recipes';
import { Recipe } from '@/context/RecipeContext';

export default function RecipeSearchScreen() {
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearch = () => {
    if (!search.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + search)
      .then(response => response.json())
      .then(data => {
        if (searched === false) {
          setSearched(true);
        }
        let response: Recipe[] = [];
        if (data.meals) {
          for (let i = 0; i < data.meals.length; i++) {
            let description = data.meals[i].strInstructions;
            description += '\n\nIngredients:';
            for (let j = 1; j <= 20; j++) {
              if (
                data.meals[i]['strIngredient' + j] !== '' &&
                data.meals[i]['strIngredient' + j] !== null
              ) {
                description +=
                  '\n - ' +
                  data.meals[i]['strMeasure' + j] +
                  ' ' +
                  data.meals[i]['strIngredient' + j];
              }
            }
            const recipe: Recipe = {
              id: data.meals[i].idMeal,
              name: data.meals[i].strMeal,
              description: description,
              category: data.meals[i].strCategory,
              imageUri: data.meals[i].strMealThumb,
            };
            response.push(recipe);
          }
        }
        setRecipes(response);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to fetch data');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      <Recipes recipes={recipes} searching={true} searched={searched} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
