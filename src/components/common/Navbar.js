import { View, Image, StatusBar, TouchableOpacity, Text } from 'react-native';
import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

import { name as appName } from '../../../app.json';
import { leftArrowImg, usernameImg, signout, home } from '../../images';

class Navbar extends Component {
  signout = () => {
    Actions.login({
      logout: true,
    });
    // AsyncStorage.multiRemove(['@jwtToken'], () => {
    //     Actions.login({
    //         currentBlock: blk,
    //         currentBed: bd
    //     });
    // });
    // clearAll = async () => {
    //     try {
    //         await AsyncStorage.clear();
    //         Actions.login();
    //     } catch (e) {
    //         // clear error
    //     }
    // };
    // clearAll();
  };

  render() {
    return (
      <View style={styles.backgroundStyle}>
        <StatusBar backgroundColor="#6a1b9a" barStyle="light-content" />
        <View style={styles.backgroundContainer}>
          {/* <TouchableOpacity onPress={() => Actions.pop()}>
                        <Image source={leftArrowImg} style={styles.imageHeight} />
                    </TouchableOpacity> 
                    <Text style={styles.heading}>{appName}</Text> */}
          <TouchableOpacity>
            <Image source={home} style={styles.imageHeight} />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.signout}>
            <Image source={signout} style={styles.imageHeight} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = {
  topStyle: {
    backgroundColor: '#9C27B0',
  },
  backgroundStyle: {
    backgroundColor: '#9C27B0',
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
  },
  backgroundContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageHeight: {
    width: 20,
    height: 20,
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    color: '#ffffff',
  },
};

export default Navbar;
