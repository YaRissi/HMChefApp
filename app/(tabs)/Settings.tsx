import { StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RootStyles } from './_layout';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import AppInput from '@/components/AppInput';

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
          <AppInput
            input={username}
            placeholder="username"
            iconName="user"
            iconPack="AntDesign"
            setInput={setUsername}
          />
          <AppInput
            input={password}
            placeholder="password"
            secureTextEntry={true}
            iconName="password"
            iconPack="MaterialIcons"
            setInput={setPassword}
          />

          <View style={styles.switchContainer}>
            <Text>Login</Text>
            <Switch
              thumbColor={registering ? '#007AFF' : '#f4f3f4'}
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
                setRegistering(false);
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
