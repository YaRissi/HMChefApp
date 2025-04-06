import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import Recipes from '@/components/Recipes';

export default function TabTwoScreen() {
  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>My Recipes</Text>
      <Recipes />
    </View>
  );
}
