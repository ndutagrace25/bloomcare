import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, View, TextInput, Image} from 'react-native';

const InputField = ({
  secureTextEntry,
  placeholder,
  autoCorrect,
  autoCapitalize,
  returnKeyType,
  keyboardType,
  handleTextChange,
  value,
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      returnKeyType={returnKeyType}
      placeholderTextColor="#2196f3"
      underlineColorAndroid="transparent"
      keyboardType={keyboardType}
      onChangeText={handleTextChange}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 0,
    marginHorizontal: 20,
    paddingLeft: 10,
  },
});

InputField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool.isRequired,
  autoCorrect: PropTypes.bool.isRequired,
  autoCapitalize: PropTypes.string.isRequired,
  returnKeyType: PropTypes.string.isRequired,
  keyboardType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
};

export default InputField;
