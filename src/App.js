import React, {Fragment} from 'react';
import {Provider} from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
import {StyleSheet, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import store from './store';
import Router from './Router';

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Router />
        <FlashMessage position="top" />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default App;
