import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface InputProps {
  input: string;
  placeholder: string;
  iconName?: string;
  iconPack: 'Ionicons' | 'AntDesign' | 'MaterialIcons';
  returnKeyType?: 'default' | 'search' | 'next';
  secureTextEntry?: boolean;
  style?: object;
  setInput: (text: string) => void;
  onSubmit?: () => void;
}

export default function AppInput({
  input,
  placeholder,
  iconName,
  iconPack,
  returnKeyType = 'default',
  secureTextEntry = false,
  style,
  setInput,
  onSubmit,
}: InputProps) {
  let IconComponent;
  switch (iconPack) {
    case 'AntDesign':
      IconComponent = AntDesign;
      break;
    case 'MaterialIcons':
      IconComponent = MaterialIcons;
      break;
    case 'Ionicons':
    default:
      IconComponent = Ionicons;
      break;
  }
  return (
    <View style={[styles.inputContainer, style]}>
      {iconName && IconComponent && (
        <IconComponent name={iconName as any} size={20} color="black" style={styles.inputIcon} />
      )}
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={onSubmit}
        returnKeyType={returnKeyType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    width: '80%',
  },
  inputIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    textAlignVertical: 'center',
  },
});
