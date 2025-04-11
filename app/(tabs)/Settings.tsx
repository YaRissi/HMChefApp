import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';

export default function SettingsScreen() {
  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>Login with Google</Text>
      <Text style={styles.Info}>Sign in to access your favorite recipes and save new ones!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  Info: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});
