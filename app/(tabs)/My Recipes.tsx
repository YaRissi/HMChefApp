import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import Recipes from '@/components/Recipes';

export default function TabTwoScreen() {
  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>My Recipe</Text>
      <Recipes />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
