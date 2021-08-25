import React from 'react';
import {Scene, Router, Stack} from 'react-native-router-flux';
import {Login, ResetPassword} from './components/auth';
import {
  ScoutList,
  Blocks,
  Stations,
  Points,
  Issues,
  Sync,
  Picker,
  Files,
} from './components/scout';
import {Navbar} from './components/common';

import {Dates} from './components/history';

const RouterComponent = () => {
  return (
    <Router navBar={Navbar}>
      <Stack key="root">
        <Scene
          key="login"
          component={Login}
          animation="fade"
          hideNavBar={true}
          initial
        />
        <Scene
          key="resetPassword"
          component={ResetPassword}
          animation="fade"
          hideNavBar={true}
          title="Reset Password"
        />
        <Scene key="files" component={Files} title="Files" />
        <Scene key="scoutList" component={ScoutList} title="Scout List" />
        <Scene key="blocks" component={Blocks} title="Blocks" />
        <Scene key="stations" component={Stations} title="Stations" />
        <Scene key="points" component={Points} title="Points" />
        <Scene key="issues" component={Issues} title="Issues" />
        <Scene key="sync" component={Sync} title="Sync" />
        <Scene key="dates" component={Dates} title="Dates" />
        <Scene key="picker" component={Picker} title="Picker" />
      </Stack>
    </Router>
  );
};

export default RouterComponent;
