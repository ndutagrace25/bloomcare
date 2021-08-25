import React, {Component} from 'react';
import {View, Text} from 'react-native';

import RNFS from 'react-native-fs';

class Files extends Component {
  componentDidMount() {
    // console.log(RNFS);

    // get a list of files and directories in the main bundle
    // RNFS.readDir(RNFS.ExternalDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //   .then(result => {
    //     console.log('GOT RESULT', result);

    //     if (result.length > 0) {
    //       // stat the first file
    //       return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //     }
    //   })
    //   .then(statResult => {
    //     if (statResult[0].isFile()) {
    //       // if we have a file, read it
    //       return RNFS.readFile(statResult[1], 'utf8');
    //     }

    //     return 'no file';
    //   })
    //   .then(contents => {
    //     // log the file contents
    //     console.log(contents);
    //   })
    //   .catch(err => {
    //     console.log(err.message, err.code);
    //   });

    let path = RNFS.ExternalDirectoryPath + '/william.txt';

    // write the file
    RNFS.writeFile(path, 'Easy peasy kama ndizi', 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  render() {
    return (
      <View>
        <Text>Hello World</Text>
      </View>
    );
  }
}

export default Files;
