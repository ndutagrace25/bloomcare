import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
  Picker,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

import {getNewScout} from '../../actions/scoutActions';
import {getPoints, addScoutPoint} from '../../actions/pointActions';

import {UserInput, ButtonSubmit} from '../common';

import {search, leftArrowImg} from '../../images';
import {
  queryAllPoints,
  createNewScout,
  findBlockById,
  findBedById,
  findStationById,
  findPointScouted,
  searchNewScout,
} from '../../models/Blocks';
import {NEW_SCOUT_POINT, NEW_SCOUT_ISSUE} from '../../models/schemas';

import moment from 'moment';

class Points extends PureComponent {
  constructor() {
    super();

    this.state = {
      points: [],
      point: '',
      newScout: [],
      isLoading: false,
      block: '',
      bed: '',
      station: '',
      blockName: '',
      bedName: '',
      stationName: '',
      personnel: {},
      realmPoints: [],
      session: '',
      realmBedId: '',
      blockRealm: '',
      pointsScouted: [],
      personnelToken: '',
      counts: [],
      stationScout: [],
      stationId: '',
    };

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  }

  handlePointChange = point =>
    this.setState({
      point,
    });

  componentDidMount() {
    const {
      currentBlock,
      currentBed,
      personnel,
      currentStation,
      session,
      bedId,
      blockRealm,
      personnelToken,
      stationId,
      currentPoint,
    } = this.props;

    this.setState({
      block: currentBlock,
      bed: currentBed,
      personnel: personnel,
      station: currentStation,
      session: session,
      realmBedId: bedId,
      blockRealm: blockRealm,
      personnelToken: personnelToken,
      stationId: stationId,
      point: currentPoint,
    });

    // this.props.getNewScout();
    // this.props.getPoints();

    queryAllPoints()
      .then(realmPoints => {
        this.setState({
          realmPoints,
        });
      })
      .catch(error => {
        this.setState({
          realmPoints: [],
        });
      });

    findBlockById(currentBlock)
      .then(PointStationBed => {
        const test = PointStationBed.map(PointStationBed => {
          this.setState({
            blockName: PointStationBed.name,
          });
          return PointStationBed.name;
        });
      })
      .catch(error => {
        this.setState({
          bedName: '',
        });
      });

    findBedById(currentBed)
      .then(PointStationBed => {
        const test = PointStationBed.map(PointStationBed => {
          this.setState({
            bedName: PointStationBed.bed_name,
          });
          return PointStationBed.bed_name;
        });
      })
      .catch(error => {
        this.setState({
          bedName: '',
        });
      });

    findStationById(currentStation)
      .then(PointStationBed => {
        const test = PointStationBed.map(PointStationBed => {
          this.setState({
            stationName: PointStationBed.name,
          });
          return PointStationBed.name;
        });
      })
      .catch(error => {
        this.setState({
          stationName: '',
        });
      });

    searchNewScout('stationRealm = "' + stationId + '"', NEW_SCOUT_ISSUE).then(
      stationScout => {
        this.setState({
          stationScout: stationScout,
        });
      },
    );
    // this.countPointScout();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.newScout !== state.newScout) {
      return {
        newScout: props.newScout,
      };
    }

    if (props.points !== state.points) {
      return {
        points: props.points,
      };
    }

    return null;
  }

  searchItem = (item, field, stateKey, match, body = null) => {
    getData = async key => {
      try {
        const value = await AsyncStorage.getItem(key);

        if (value !== null) {
          let items = JSON.parse(value);

          if (body !== null) {
            items = items[body];
          }

          const search = items.filter(itm => itm._id === match);

          this.setState({
            [stateKey]: search[0][field],
          });
        }
      } catch (e) {
        dispatch(createError(e, GET_ERRORS));
      }
    };

    getData(item);
  };

  selectPoint = point => {
    if (this.state.isLoading) return;

    this.setState({
      isLoading: true,
    });

    const {
      block,
      bed,
      station,
      personnel,
      session,
      realmBedId,
      blockRealm,
      personnelToken,
      stationId
    } = this.state;

    const _id = Math.floor(Date.now() / 1000);

    const data = {
      _id: _id,
      station: stationId,
      point: point,
      created: moment().format(),
    };

    searchNewScout(
      'point = "' + point + '" AND station = "' + stationId + '"',
      NEW_SCOUT_POINT,
    ).then(scoutedPoints => {
      if (scoutedPoints.length === 0) {
        createNewScout(data, NEW_SCOUT_POINT)
          .then(() => {
            Actions.issues({
              personnel: personnel,
              currentBlock: block,
              currentBed: bed,
              currentStation: station,
              currentPoint: point,
              pointId: _id,
              stationId: stationId,
              bedId: realmBedId,
              session: session,
              blockRealm: blockRealm,
              personnelToken: personnelToken,
            });
          })
          .catch(error => {
            alert(`insert new block error ${error}`);
          });
      } else {
        Actions.issues({
          personnel: personnel,
          currentBlock: block,
          currentBed: bed,
          currentStation: station,
          currentPoint: point,
          pointId: scoutedPoints[0]._id,
          stationId: scoutedPoints[0].station,
          bedId: realmBedId,
          session: session,
          blockRealm: blockRealm,
          personnelToken: personnelToken,
        });
      }
    });
  };

  countPointScout = pointId => {
    const {
      newScout,
      block,
      bed,
      station,
      personnel,
      pointsScouted,
      stationScout,
    } = this.state;

    const scoutedPoints = stationScout.filter(issue => {
      return issue.point === pointId;
    });

    return scoutedPoints.length;
  };

  renderPoints = ({item}) => {
    // const {stationScout} = this.state;
    const totalScouted = this.countPointScout(item._id);
    let itemStyle = totalScouted >= 1 ? styles.blueText : styles.grayText;
    let cardStyle = totalScouted >= 1 ? styles.cardBlue : styles.cardGray;


    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          this.selectPoint(item._id);
        }}
        activeOpacity={1}>
        <View style={cardStyle}>
          <Text style={itemStyle}>{item.name}</Text>
          <Text style={itemStyle}> {totalScouted} </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderHeading = () => {
    const {blockName, bedName, stationName} = this.state;

    return (
      <Text style={styles.heading}>
        {blockName} > {bedName} > {stationName}
      </Text>
    );
  };

  render() {
    const {
      points,
      personnel,
      block,
      bed,
      realmPoints,
      session,
      realmBedId,
      blockRealm,
      personnelToken,
      pointsScouted,
      stationScout,
    } = this.state;

    return (
      <View>
        <View style={styles.navHeader}>
          <TouchableOpacity
            onPress={() => {
              Actions.stations({
                personnel: personnel,
                currentBlock: block,
                currentBed: bed,
                session: session,
                bedId: realmBedId,
                blockRealm: blockRealm,
                personnelToken: personnelToken,
              });
            }}
            style={styles.imageContainer}>
            <Image source={leftArrowImg} style={styles.imageHeight} />
          </TouchableOpacity>
          <Text style={styles.navHeading}> SELECT POINT </Text>
        </View>
        <View style={styles.header}>{this.renderHeading()}</View>
        <View style={styles.container}>
          <FlatList
            data={realmPoints}
            renderItem={this.renderPoints}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
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

Points.propTypes = {
  getPoints: PropTypes.func.isRequired,
  getNewScout: PropTypes.func.isRequired,
  addScoutPoint: PropTypes.func.isRequired,
  points: PropTypes.array.isRequired,
  newScout: PropTypes.array.isRequired,
  currentBlock: PropTypes.string.isRequired,
  currentBed: PropTypes.string.isRequired,
  currentStation: PropTypes.string.isRequired,
  // personnel: PropTypes.object.isRequired,
  personnel: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  points: state.points.points,
  newScout: state.scout.newScout,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getPoints,
  getNewScout,
  addScoutPoint,
})(Points);
