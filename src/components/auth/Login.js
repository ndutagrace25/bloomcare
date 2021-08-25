import React, {Component, Fragment} from 'react';
import {
  View,
  Easing,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Dimensions from 'Dimensions';

import {Wallpaper, Logo, SignupSection, ButtonLogin, Loader} from '../common';

import {setAuthToken, showError} from '../../utils';
import LoginForm from './LoginForm';
import {loginPersonnel} from '../../actions/personnelActions';

const initialState = {
  phone: '',
  password: '',
  isAuthenticated: false,
  isLoading: false,
  errors: {},
};

class Login extends Component {
  constructor() {
    super();

    this.state = initialState;
  }

  handlePhoneChange = phone => this.setState({phone});

  handlePasswordChange = password => this.setState({password});

  handleLogin = () => {
    if (this.state.isLoading) return;

    const {phone, password} = this.state;

    getData = async key => {
      try {
        const value = await AsyncStorage.getItem(key);

        if (value !== null) {
          const usersObj = JSON.parse(value);

          const user = usersObj.filter(item => {
            return item.phone === phone;
          });

          if (user.length > 0) {

            let userFound = false;

            for (let r = 0; r < user.length; r++) {

              if (user[r].phone === phone) {

                userFound = true;

                if (user[r].password === password) {
                  // await AsyncStorage.setItem('@jwtToken', user);
                  Actions.scoutList({ personnel: user[r].phone, personnelToken: user[r]});
                } else {
                  showError(
                    'Login Error',
                    'You have entered an incorrect password. Please try again',
                    'danger',
                  );
                  break;
                }
              }
            }

            if(!userFound){
              this.loginPersonnel(phone, password);
            } else {
              this.setState({ isLoading: false });
            }
          } else {
            this.loginPersonnel(phone, password);
          }
        } else {
          this.loginPersonnel(phone, password);
        }
      } catch (e) {
        console.log(e);
        this.setState({isLoading: false});
        showError(
          'Login Error',
          e.message,
          'danger',
        );
      }
    };

    if (phone === '') {
      showError('Login Error', 'Phone is required', 'danger');
    } else if (password === '') {
      showError('Login Error', 'Password is required', 'danger');
    } else {
      this.setState({isLoading: true});

      getData('@user');
    }
  };

  loginPersonnel = (phone, password) => {
    
    const personnel = {
      phone: phone,
      password: password,
    };

    this.props.loginPersonnel(personnel);
  };

  loadResetPassword = () => {
    Actions.resetPassword();
  };

  componentDidMount() {
    this.setState(initialState);

    this.setState({isLoading: true});

    const {logout} = this.props;

    getData = async key => {
      try {
        const value = await AsyncStorage.getItem(key);

        if (value !== null) {
          //set token to auth header
          const jwtToken = JSON.parse(value);

          setAuthToken(jwtToken.token);
          Actions.scoutList({personnel: jwtToken.phone, personnelToken: jwtToken});
        } else {
          this.setState({isLoading: false});
        }
      } catch (e) {
        console.log(e.message);
      }
    };

    removeData = async key => {
      try {
        await AsyncStorage.multiRemove([key], () => {
          getData(key);
        });
      } catch (e) {
        console.log(e.message);
      }
    };

    if (logout) {
      this.setState({isAuthenticated: false});
      removeData('@jwtToken');
    } else {
      getData('@jwtToken');
    }
    // clearAll = async () => {
    //     try {
    //         await AsyncStorage.clear()
    //     } catch (e) {
    //         // clear error
    //     }

    //     console.log('Done.')
    // }
    // clearAll();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated !== state.isAuthenticated) {
      Actions.scoutList({personnel: props.auth.personnel.personnel.phone, personnelToken: props.auth.personnel.personnel});
      return {
        isAuthenticated: props.auth.isAuthenticated,
        isLoading: false,
      };
    }

    if (props.errors !== state.errors) {
      let message;

      if (props.errors.phone) {
        message = props.errors.phone;
      } else if (props.errors.password) {
        message = props.errors.password;
      } else if (props.errors.error) {
        message = props.errors.error;
      }

      if (message !== '' && typeof message !== 'undefined') {
        showError('Login Error', message, 'danger');
      }

      return {
        errors: props.errors,
        isLoading: false,
      };
    }

    return null;
  }

  renderLoader = () => {
    const {isLoading} = this.state;

    if (isLoading) {
      return <Loader />;
    } else {
      return null;
    }
  };

  loadLoginPage() {
    const {phone, password} = this.state;

    return (
      <Wallpaper>
        {this.renderLoader()}
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.container}>
          <Logo />
          <LoginForm
            handlePhoneChange={this.handlePhoneChange}
            handlePasswordChange={this.handlePasswordChange}
            phone={phone}
            password={password}
          />
          <View style={styles.buttonContainer}>
            <ButtonLogin title="LOGIN" onPress={this.handleLogin} />
          </View>
          <SignupSection
            onPress={this.loadResetPassword}
            title="Reset Password"
          />
        </ScrollView>
      </Wallpaper>
    );
  }
  render() {
    return this.loadLoginPage();
  }
}

// const DEVICE_WIDTH = Dimensions.get('window').width;
//const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 20,
  },
});

Login.propTypes = {
  loginPersonnel: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.auth.errors,
});

export default connect(
  mapStateToProps,
  {
    loginPersonnel,
  },
)(Login);
