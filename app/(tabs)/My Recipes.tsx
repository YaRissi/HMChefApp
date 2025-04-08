import { View } from '@/components/Themed';
import { RootStyles } from './_layout';
import Recipes from '@/components/Recipes';
import { useRecipes } from '@/context/RecipeContext';

export default function TabTwoScreen() {
  const { allrecipes } = useRecipes();

  return (
    <View style={RootStyles.container}>
      <Recipes recipes={allrecipes} />
    </View>
  );
}
