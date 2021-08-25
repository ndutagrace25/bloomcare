import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

import {UserInput, ButtonLogin, SignupSection} from '../common';

import {usernameImg, passwordImg, eyeImg} from '../../images';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  render() {
    const {phone, password} = this.props;

    return (
      <View>
        <UserInput
          iconSource={usernameImg}
          secureTextEntry={false}
          placeholder="07xxxxxxxx"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
          keyboardType="phone-pad"
          handleTextChange={this.props.handlePhoneChange}
          value={phone}
        />
        <UserInput
          iconSource={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder="Password"
          returnKeyType={'done'}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType="default"
          handleTextChange={this.props.handlePasswordChange}
          value={password}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}>
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {},
  btnEye: {
    position: 'absolute',
    top: 68,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
});

LoginForm.propTypes = {
  phone: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handlePhoneChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
};

export default LoginForm;
