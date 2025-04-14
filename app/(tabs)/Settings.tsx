import { StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function SettingsScreen() {
  const { user, login, register, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  const toggleSwitch = () => setRegistering(registering => !registering);

  return (
    <View style={RootStyles.container}>
      {user ? (
        <>
          <Text style={RootStyles.title}>Welcome back, {user.username}!</Text>
          <TouchableOpacity>
            <Text style={styles.button} onPress={logout}>
              Logout
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={RootStyles.title}>Welcome to Recipe App!</Text>
          <Text style={styles.Info}>
            Sign in to access your recipes and sync them between devices.
          </Text>
          <TextInput
            placeholder="username"
            style={[styles.input]}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="password"
            style={[styles.input]}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.switchContainer}>
            <Text>Login</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={registering ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleSwitch}
              value={registering}
              style={styles.switch}
            />
            <Text>Register</Text>
          </View>

          <TouchableOpacity>
            <Text
              style={styles.button}
              onPress={() => {
                registering ? register({ username, password }) : login({ username, password });
                setPassword('');
                setUsername('');
              }}
            >
              {registering ? 'Create Account' : 'Login'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Info: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    width: '80%',
    marginBottom: 10,
  },
  button: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 40,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  switch: {
    marginHorizontal: 10,
  },
});
