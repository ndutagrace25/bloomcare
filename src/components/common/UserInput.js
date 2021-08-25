import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, View, TextInput, Image} from 'react-native';

const UserInput = ({
  iconSource,
  placeholder,
  secureTextEntry,
  autoCorrect,
  autoCapitalize,
  returnKeyType,
  keyboardType,
  handleTextChange,
  value,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Image source={iconSource} style={styles.inlineImg} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        placeholderTextColor="white"
        underlineColorAndroid="transparent"
        keyboardType={keyboardType}
        onChangeText={handleTextChange}
        value={value}
      />
    </View>
  );
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#ffffff',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
  },
});

UserInput.propTypes = {
  iconSource: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool.isRequired,
  autoCorrect: PropTypes.bool.isRequired,
  autoCapitalize: PropTypes.string.isRequired,
  returnKeyType: PropTypes.string.isRequired,
  keyboardType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
};

export default UserInput;
