import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={RootStyles.container}>
      <Text style={RootStyles.title}>The Crazy HM Chef</Text>
      <Image source={require('@/assets/images/chef.jpg')} style={styles.image} />
      <Text style={styles.description}>
        Here you can find and collect the best recipes for your home made meals.
      </Text>
      <Text style={styles.description}>
        {!user ? 'Login in to sync your recipes across devices.' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
});
