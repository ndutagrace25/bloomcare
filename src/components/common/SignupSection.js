import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

class SignupSection extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPress}
        activeOpacity={1}>
        <Text style={styles.text}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});

SignupSection.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default SignupSection;
