import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useRecipes, Recipe } from '@/context/RecipeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface RecipeProps {
  recipes: Recipe[];
  searching?: boolean;
  searched?: boolean;
}

export default function Recipes({ recipes, searching, searched }: RecipeProps) {
  const { deleteRecipe, addRecipe, allrecipes } = useRecipes();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? '#000' : '#fff';

  const renderRecipes = ({ item }: { item: Recipe }) => {
    const isNew = !allrecipes.some(
      recipe => recipe.name === item.name && recipe.description === item.description,
    );

    return (
      <View style={styles.recipeCard}>
        <TouchableOpacity
          onPress={() => {
            setSelectedRecipe(item);
            setModalVisible(true);
          }}
        >
          {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.recipeImage} />}
        </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {selectedRecipe?.imageUri ? (
              <Image
                source={{ uri: selectedRecipe.imageUri }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.modalImage, styles.noImage]}>
                <Text style={styles.noImageText}>Image not found</Text>
              </View>
            )}

            <View style={styles.modalRecipeContent}>
              <Text style={styles.recipeName}>{selectedRecipe?.name}</Text>
              <Text style={styles.category}>{selectedRecipe?.category}</Text>
              <ScrollView style={(styles.descriptionScrollView, styles.modaldescriptionScrollView)}>
                <Text style={styles.recipeDescription}>{selectedRecipe?.description}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const windowHeight = Dimensions.get('window').height;

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
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalImage: {
    width: '100%',
    height: windowHeight / 2,
  },
  noImage: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 18,
    color: 'black',
  },
  modalRecipeContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modaldescriptionScrollView: {
    maxHeight: windowHeight / 2,
  },
});
