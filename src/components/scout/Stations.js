import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from 'react-native-router-flux';
import {AndroidBackHandler} from 'react-navigation-backhandler';

import {getNewScout} from '../../actions/scoutActions';
import {getStations, addScoutStation} from '../../actions/stationActions';
import {getPoints} from '../../actions/pointActions';

import {UserInput} from '../common';
import {
  queryAllStations,
  findBlockById,
  findBedById,
  createNewScout,
  queryAllPoints,
  searchNewScout,
} from '../../models/Blocks';
import {NEW_SCOUT_STATION, NEW_SCOUT_ISSUE} from '../../models/schemas';
import moment from 'moment';

import {search, leftArrowImg} from '../../images';

class Stations extends PureComponent {
  constructor() {
    super();

    this.state = {
      stations: [],
      station: '',
      newScout: [],
      isLoading: false,
      block: '',
      blockName: '',
      bedName: '',
      bed: '',
      points: [],
      personnel: {},
      realmStations: [],
      realmAllScouts: [],
      currentRealmBlock: '',
      currentRealmPersonnel: '',
      currentRealmBed: '',
      session: '',
      blockRealm: '',
      personnelToken: '',
      bedScout: [],
      bedId: '',
    };
  }

  handleStationChange = station =>
    this.setState({
      station,
    });

  componentDidMount() {
    const {
      currentBlock,
      currentBed,
      personnel,
      session,
      blockRealm,
      personnelToken,
      bedId,
    } = this.props;

    this.setState({
      block: currentBlock,
      bed: currentBed,
      personnel: personnel,
      session: session,
      blockRealm: blockRealm,
      bedId: bedId,
      personnelToken: personnelToken,
    });


    queryAllStations()
      .then(realmStations => {
        this.setState({
          realmStations,
        });
      })
      .catch(error => {
        this.setState({
          realmStations: [],
        });
      });

    queryAllPoints()
      .then(points => {
        this.setState({
          points,
        });
      })
      .catch(error => {
        this.setState({
          points: [],
        });
      });

    findBlockById(currentBlock)
      .then(stationBlock => {
        const test = stationBlock.map(stationBlock => {
          this.setState({
            blockName: stationBlock.name,
          });
          return stationBlock.name;
        });
      })
      .catch(error => {
        this.setState({
          blockName: '',
        });
      });

    findBedById(currentBed)
      .then(stationBed => {
        const test = stationBed.map(stationBed => {
          this.setState({
            bedName: stationBed.bed_name,
          });
          return stationBed.bed_name;
        });
      })
      .catch(error => {
        this.setState({
          bedName: '',
        });
      });

    searchNewScout('bedRealm = "' + bedId + '"', NEW_SCOUT_ISSUE).then(
      bedScout => {
        this.setState({
          bedScout: bedScout,
        });
      },
    );

    // this.searchItem('@blocks', 'name', 'blockName', this.props.currentBlock);
    // this.searchItem('@beds', 'bed_name', 'bedName', this.props.currentBed);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.newScout !== state.newScout) {
      return {
        newScout: props.newScout,
      };
    }

    if (props.stations !== state.stations) {
      return {
        stations: props.stations,
      };
    }

    // if (props.points !== state.points) {
    //   return {
    //     points: props.points,
    //   };
    // }

    return null;
  }

  selectStation = station => {
    if (this.state.isLoading) return;

    this.setState({
      isLoading: true,
    });

    const {
      block,
      bed,
      personnel,
      session,
      blockRealm,
      personnelToken,
    } = this.state;

    const _id = Math.floor(Date.now() / 1000);
    const {bedId} = this.props;

    const data = {
      _id: _id,
      bed: bedId,
      station: station,
      created: moment().format(),
    };

    searchNewScout(
      'station = "' + station + '" AND bed = "' + bedId + '"',
      NEW_SCOUT_STATION,
    )
      .then(scoutedStation => {
        if (scoutedStation.length === 0) {
          createNewScout(data, NEW_SCOUT_STATION)
            .then(() => {
              Actions.points({
                personnel: personnel,
                currentBlock: block,
                currentBed: bed,
                currentStation: station,
                stationId: _id,
                bedId: bedId,
                session: session,
                blockRealm: blockRealm,
                personnelToken: personnelToken,
              });
            })
            .catch(error => {
              alert(`insert new block error ${error}`);
            });
        } else {
          Actions.points({
            personnel: personnel,
            currentBlock: block,
            currentBed: bed,
            currentStation: station,
            stationId: scoutedStation[0]._id,
            bedId: bedId,
            session: session,
            blockRealm: blockRealm,
            personnelToken: personnelToken,
          });
        }
      })
      .catch(err => console.log(err));
  };

  countStationScout = stationId => {
    const {bedScout, block, bed, personnel} = this.state;

    const scoutedStations = bedScout.filter(issue => {
      return issue.entry === stationId;
    });
    return scoutedStations.length;
  };

  countTotalPoints = () => {
    const {points} = this.state;

    return points.length;
  };

  renderStations = ({item}) => {
    const totalScouted = this.countStationScout(item._id);
    const totalPoints = this.countTotalPoints();

    let itemStyle =
      totalScouted >= 1 ? styles.blueText : styles.grayText;
    let cardStyle =
      totalScouted >= 1 ? styles.cardBlue : styles.cardGray;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          this.selectStation(item._id);
        }}
        activeOpacity={1}>
        <View style={cardStyle}>
          <Text style={itemStyle}>{item.name}</Text>
          <Text style={itemStyle}>
            {this.countStationScout(item._id)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderHeading = () => {
    const {blockName, bedName} = this.state;

    return (
      <Text style={styles.heading}>
        {blockName} > {bedName}
      </Text>
    );
  };

  render() {
    const {
      stations,
      personnel,
      realmStations,
      realmAllScouts,
      currentRealmBed,
      currentRealmBlock,
      currentRealmPersonnel,
      session,
      personnelToken,
      bedScout,
      bedId
    } = this.state;


    return (
      <AndroidBackHandler
        onBackPress={() => {
          Actions.blocks({
            personnel: personnel,
            session: session,
            personnelToken: personnelToken,
            bedId: bedId
          });
        }}>
        <View style={styles.container}>
          <View style={styles.navHeader}>
            <TouchableOpacity
              onPress={() => {
                Actions.blocks({
                  personnel,
                  session: session,
                  bedId: bedId,
                  personnelToken: personnelToken,
                });
              }}
              style={styles.imageContainer}>
              <Image source={leftArrowImg} style={styles.imageHeight} />
            </TouchableOpacity>
            <Text style={styles.navHeading}> SELECT STATION </Text>
          </View>
          <View style={styles.header}>{this.renderHeading()}</View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <FlatList
              keyboardShouldPersistTaps="always"
              data={realmStations}
              renderItem={this.renderStations}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </View>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(100),
  },
  scrollContainer: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveHeight(10),
  },
  navHeader: {
    backgroundColor: '#ffffff',
    height: 40,
    elevation: 6,
    marginBottom: 0,
    justifyContent: 'center',
  },
  imageContainer: {
    marginLeft: 20,
    position: 'absolute',
    top: 10,
    zIndex: 1,
  },
  imageHeight: {
    height: 20,
    width: 20,
  },
  navHeading: {
    color: '#9C27B0',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#9C27B0',
    height: 30,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'center',
  },
  heading: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
  },
  cardBlue: {
    marginTop: 8,
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#2196F3',
    borderBottomWidth: 10,
  },
  cardGray: {
    marginTop: 8,
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#9e9e9e',
    borderBottomWidth: 10,
  },
  blueText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 15,
  },
  grayText: {
    color: '#9e9e9e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  backView: {
    marginTop: 20,
    flex: 0,
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    color: '#9C27B0',
  },
});

Stations.propTypes = {
  getPoints: PropTypes.func.isRequired,
  getStations: PropTypes.func.isRequired,
  getNewScout: PropTypes.func.isRequired,
  addScoutStation: PropTypes.func.isRequired,
  // points: PropTypes.array.isRequired,
  stations: PropTypes.array.isRequired,
  newScout: PropTypes.array.isRequired,
  currentBlock: PropTypes.string.isRequired,
  currentBed: PropTypes.string.isRequired,
  // personnel: PropTypes.object.isRequired,
  personnel: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  // points: state.points.points,
  stations: state.stations.stations,
  newScout: state.scout.newScout,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getPoints,
  getStations,
  getNewScout,
  addScoutStation,
})(Stations);
