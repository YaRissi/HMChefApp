import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Recipes from '@/components/Recipes';
import { Recipe } from '@/context/RecipeContext';

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearch = () => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + search)
      .then(response => response.json())
      .then(data => {
        if (searched === false) {
          setSearched(true);
        }
        let response: Recipe[] = [];
        if (data.meals) {
          for (let i = 0; i < data.meals.length; i++) {
            const description = data.meals[i].strInstructions;
            const recipe: Recipe = {
              id: data.meals[i].idMeal,
              name: data.meals[i].strMeal,
              description: description,
              imageUri: data.meals[i].strMealThumb,
            };
            response.push(recipe);
          }
        }
        setRecipes(response);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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
      <Recipes recipes={recipes} new={true} searched={searched} />
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
