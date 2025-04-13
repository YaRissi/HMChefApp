import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useRecipes, Recipe } from '@/context/RecipeContext';

interface RecipeProps {
  recipes: Recipe[];
  searching?: boolean;
  searched?: boolean;
}

export default function Recipes({ recipes, searching, searched }: RecipeProps) {
  const { deleteRecipe, addRecipe, allrecipes } = useRecipes();
  const colorScheme = useColorScheme();

  const textColor = colorScheme === 'light' ? '#000' : '#fff';

  const renderRecipes = ({ item }: { item: Recipe }) => {
    const isNew = !allrecipes.some(
      recipe => recipe.name === item.name && recipe.description === item.description,
    );

    return (
      <View style={styles.recipeCard}>
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.recipeImage} />}
        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <ScrollView style={styles.descriptionScrollView} nestedScrollEnabled={true}>
            <Text style={styles.recipeDescription}>{item.description}</Text>
          </ScrollView>
        </View>
        {isNew && (
          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              addRecipe({
                id: item.id ? item.id : null,
                name: item.name,
                description: item.description,
                category: item.category,
                imageUri: item.imageUri,
              } as Recipe);
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
        {!isNew && (
          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              deleteRecipe(item.id);
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        searching ? (
          searched ? (
            <Text style={[styles.emptyText, { color: textColor }]}>
              No recipes found. Please try a different search term.
            </Text>
          ) : (
            <Text style={[styles.emptyText, { color: textColor }]}></Text>
          )
        ) : (
          <Text style={[styles.emptyText, { color: textColor }]}>No recipes added yet.</Text>
        )
      ) : (
        <FlatList data={recipes} renderItem={renderRecipes} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  recipeContent: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionScrollView: {
    maxHeight: 100,
    paddingRight: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: 'grey',
  },
  category: {
    fontSize: 17,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  Button: {
    justifyContent: 'center',
    padding: 8,
  },
  addButtonText: {
    color: 'green',
  },
  deleteButtonText: {
    color: 'red',
  },
});
