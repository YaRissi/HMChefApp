import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRecipes, Recipe } from '@/context/RecipeContext';

export default function Recipes() {
  const { recipes, deleteRecipe } = useRecipes();

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.recipeImage} />}
      <View style={styles.recipeContent}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecipe(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes added yet.</Text>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  list: {
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
    flex: 1,
    marginLeft: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    justifyContent: 'center',
    padding: 8,
  },
  deleteButtonText: {
    color: 'red',
  },
});
