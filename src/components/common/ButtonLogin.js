import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';

const MARGIN = 40;

class ButtonSubmit extends PureComponent {
  constructor() {
    super();
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}
        activeOpacity={1}>
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D500F9',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3.8,
    elevation: 4,
    width: DEVICE_WIDTH - 40,
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});

ButtonSubmit.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ButtonSubmit;
