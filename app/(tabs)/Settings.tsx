import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';

export default function TabOneScreen() {
  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>Login with GitHub</Text>
      <Text style={styles.additionalInfo}>
        Sign in to access your favorite recipes and save new ones!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  additionalInfo: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});
