import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {showMessage} from 'react-native-flash-message';

import {
  Wallpaper,
  Logo,
  SignupSection,
  ButtonLogin,
  Loader,
  UserInput,
} from '../common';
import {usernameImg, passwordImg, eyeImg} from '../../images';
import {resetPersonnelPassword} from '../../actions/personnelActions';

const initialState = {
  phone: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isLoading: false,
  reset: false,
};

class ResetPassword extends Component {
  constructor() {
    super();

    this.state = initialState;
  }

  handlePhoneChange = phone => this.setState({phone});

  handlePasswordChange = password => this.setState({password});

  handleConfirmPasswordChange = confirmPassword =>
    this.setState({confirmPassword});

  handleChangePassword = () => {
    if (this.state.isLoading) return;

    const {phone, password, confirmPassword} = this.state;

    if (phone === '') {
      this.showError('ERROR', 'Phone is required');
    } else if (password === '') {
      this.showError('ERROR', 'Password is required');
    } else if (confirmPassword === '') {
      this.showError('ERROR', 'Confirm Password is required');
    } else if (password !== confirmPassword) {
      this.showError('ERROR', 'Password does not match confirm password');
    } else {
      this.setState({isLoading: true});

      const personnel = {
        phone: phone,
        password: password,
      };

      this.props.resetPersonnelPassword(personnel);
    }
  };

  showError = (title, message) => {
    showMessage({
      message: title,
      description: message,
      type: 'danger',
      icon: 'danger',
      duration: 5000,
    });
  };

  renderLoader = () => {
    const {isLoading} = this.state;

    if (isLoading) {
      return <Loader />;
    } else {
      return null;
    }
  };

  loadLogin = () => {
    Actions.login();
  };

  static getDerivedStateFromProps(props, state) {
    if (props.reset !== state.reset) {
      if (!props.reset) {
        return {
          reset: props.reset,
          isLoading: false,
        };
      } else {
        showMessage({
          message: 'SUCCESS',
          description: 'Password reset successfully. Please log in',
          type: 'success',
          icon: 'success',
          duration: 5000,
        });
        Actions.login();
      }
    }

    if (props.errors !== state.errors) {
      let message;

      if (props.errors.phone) {
        message = props.errors.phone;
      } else if (props.errors.password) {
        message = props.errors.password;
      }

      if (message !== '' && typeof message !== 'undefined') {
        showMessage({
          message: 'ERROR!',
          description: message,
          type: 'danger',
          icon: 'danger',
          duration: 5000,
        });
      }

      return {
        errors: props.errors,
        isLoading: false,
      };
    }

    return null;
  }

  loadResetPage = () => {
    const {phone, password, confirmPassword} = this.state;

    return (
      <Wallpaper>
        {this.renderLoader()}
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container}>
          <Logo />
          <UserInput
            iconSource={usernameImg}
            secureTextEntry={false}
            placeholder="07xxxxxxxx"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            keyboardType="phone-pad"
            handleTextChange={this.handlePhoneChange}
            value={phone}
          />
          <UserInput
            iconSource={passwordImg}
            secureTextEntry={true}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType="default"
            handleTextChange={this.handlePasswordChange}
            value={password}
          />
          <UserInput
            iconSource={passwordImg}
            secureTextEntry={true}
            placeholder="Confirm Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType="default"
            handleTextChange={this.handleConfirmPasswordChange}
            value={confirmPassword}
          />
          <View style={styles.buttonContainer}>
            <ButtonLogin
              title="RESET PASSWORD"
              onPress={this.handleChangePassword}
            />
          </View>
          <SignupSection onPress={this.loadLogin} title="Login" />
        </ScrollView>
      </Wallpaper>
    );
  };

  render() {
    return this.loadResetPage();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginHorizontal: 20,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
});

ResetPassword.propTypes = {
  resetPersonnelPassword: PropTypes.func.isRequired,
  // errors: PropTypes.object.isRequired,
  reset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  reset: state.auth.reset,
});

export default connect(
  mapStateToProps,
  {
    resetPersonnelPassword,
  },
)(ResetPassword);
