import * as React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';

import logoImg from '../../images/bloomcare-logo-white.png';

import Dimensions from 'Dimensions';

export default class Logo extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode={'contain'} source={logoImg} style={styles.image} />
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: DEVICE_HEIGHT / 3,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: DEVICE_WIDTH - 160,
    paddingBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});
