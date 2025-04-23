import { StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { Recipe } from '@/context/RecipeContext';
import AppInput from '@/components/AppInput';
import Recipes from '@/components/Recipes';

export default function RecipeSearchScreen() {
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setSearched(false);
      setSearch('');
      setRecipes([]);
    }
  }, [isFocused]);

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
      <AppInput
        input={search}
        placeholder="Search for a recipe..."
        iconName="search"
        iconPack="Ionicons"
        returnKeyType="search"
        style={{ width: null }}
        setInput={setSearch}
        onSubmit={handleSearch}
      />
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
});
