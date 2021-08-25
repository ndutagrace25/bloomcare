import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import RNFS from 'react-native-fs';

import {ButtonSubmit, Loader} from '../common';
import {showError} from '../../utils';

import {getNewScout, syncScouting} from '../../actions/scoutActions';
import {fetchBeds} from '../../actions/bedActions';
import {getStations} from '../../actions/stationActions';
import {getPoints} from '../../actions/pointActions';

import {scouted, leftArrowImg} from '../../images';
const SIZE = 40;

class Sync extends Component {
  constructor() {
    super();

    this.state = {
      errors: '',
      syncFilesCount: 0,
      syncFiles: [],
      path: RNFS.ExternalDirectoryPath,
    };
  }

  componentDidMount() {
    this.setState({
      personnel: this.props.personnel,
      personnelToken: this.props.personnelToken,
    });

    if (this.props.message) {
      if (this.props.message === 'success') {
        showError('Success', 'Data Synced Successfully', 'success');
      }
    }

    this.fetchFiles();
  }

  fetchFiles = () => {
    const {path} = this.state;

    // write the file
    RNFS.readDir(path)
      .then(syncFiles => {
        this.setState({syncFiles});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  renderHeading = () => {
    const {personnelToken, personnel} = this.state;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.scoutList({personnel, personnelToken});
          }}
          style={styles.imageContainer}>
          <Image source={leftArrowImg} style={styles.imageHeight} />
        </TouchableOpacity>
        <Text style={styles.heading}>SYNC SCOUTING</Text>
      </View>
    );
  };

  syncScouting = (selectedFile, fileName) => {
    if (this.state.isLoading) return;

    this.setState({isLoading: true, selectedFile: selectedFile});

    const {personnelToken, personnel} = this.state;

    // console.log(selectedFile);

    RNFS.readFile(selectedFile, 'utf8')
      .then(syncFileContent => {
        // console.log(syncFileContent);
        // Remove trailing comma
        syncFileContent = syncFileContent.substring(
          0,
          syncFileContent.length - 1,
        );

        // Add square brackets
        syncFileContent = '[' + syncFileContent + ']';

        // Remove file extension
        fileName = fileName.substring(0, fileName.length - 4);

        // log the file syncFileContent
        // console.log(syncFileContent);

        this.props.syncScouting(
          syncFileContent,
          fileName,
          personnelToken,
          personnel,
        );
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.errors !== state.errors) {
      // console.log(props.errors);

      let returnObject = {
        errors: message,
      };

      const message = props.errors.error;

      if (message !== '' && typeof message !== 'undefined') {
        returnObject['isLoading'] = false;
        showError('Sync Error', message, 'danger');
      }

      return returnObject;
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

  renderFiles = () => {
    const {syncFiles} = this.state;
    const allFiles = syncFiles.map((file, index) => (
      <View style={styles.card} key={index}>
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Text style={styles.purpleText}>{file.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={() => {
              this.syncScouting(file.path, file.name);
            }}>
            <Text style={styles.syncText}>{'Sync ' + file.name}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
    return allFiles;
  };

  render() {
    const {isLoading} = this.state;

    return (
      <Fragment>
        {this.renderLoader()}
        <View style={styles.container}>
          <View style={styles.header}>{this.renderHeading()}</View>
          {this.renderFiles()}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  imageContainer: {
    marginLeft: 20,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  imageHeight: {
    height: 20,
    width: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    height: 40,
    elevation: 2,
    marginBottom: 0,
    justifyContent: 'center',
  },
  heading: {
    color: '#9C27B0',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
  },
  image: {
    width: 15,
  },
  image: {
    width: 24,
    height: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#32485f',
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 2,
    borderColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 0,
  },
  purpleText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  cardBody: {
    color: '#32485f',
    padding: 14,
  },
  cardRow: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#9e9e9e',
    paddingBottom: 14,
    marginBottom: 14,
    width: '100%',
  },
  syncButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    height: 30,
    zIndex: 100,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 1.8,
    elevation: 2,
    width: '100%',
  },
  syncText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: responsiveFontSize(1.6),
  },
});

Sync.propTypes = {
  fetchBeds: PropTypes.func.isRequired,
  syncScouting: PropTypes.func.isRequired,
  getStations: PropTypes.func.isRequired,
  getPoints: PropTypes.func.isRequired,
  getNewScout: PropTypes.func.isRequired,
  newScout: PropTypes.array.isRequired,
  beds: PropTypes.array.isRequired,
  stations: PropTypes.array.isRequired,
  points: PropTypes.array.isRequired,
  personnel: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

const mapStateToProps = state => ({
  newScout: state.scout.newScout,
  beds: state.beds.beds,
  stations: state.stations.stations,
  points: state.points.points,
  errors: state.scout.errors,
});

export default connect(mapStateToProps, {
  fetchBeds,
  syncScouting,
  getStations,
  getPoints,
  getNewScout,
})(Sync);
