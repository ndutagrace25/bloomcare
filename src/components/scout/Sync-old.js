import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import AsyncStorage from '@react-native-community/async-storage';
import {FloatingAction} from 'react-native-floating-action';

import {ButtonSubmit, Loader} from '../common';
import {showError} from '../../utils';

import {getNewScout, syncScouting} from '../../actions/scoutActions';
import {fetchBeds} from '../../actions/bedActions';
import {getStations} from '../../actions/stationActions';
import {getPoints} from '../../actions/pointActions';

import {scouted, leftArrowImg} from '../../images';
import {
  queryAllNewScouts,
  findItemById,
  findBedByBlock,
  searchNewScout,
} from '../../models/Blocks';
import {
  NEW_SCOUT_SESSION,
  NEW_SCOUT_ISSUE,
  BEDS,
  STATIONS,
  POINTS,
  BLOCKS,
  NEW_SCOUT_POINT,
  NEW_SCOUT_STATION,
  NEW_SCOUT_BED,
  NEW_SCOUT_BLOCK,
} from '../../models/schemas';
const SIZE = 40;

class Sync extends Component {
  constructor() {
    super();

    this.state = {
      newScout: [],
      beds: [],
      stations: [],
      points: [],
      personnelBlocks: [],
      isLoading: false,
      personnel: '',
      personnelToken: {},
      errors: {},
      RealmNewScoutIssue: [],
      realmBlocks: [],
      realmBeds: [],
      realmStations: [],
      realmPoints: [],
      pointsSubmitted: [],
      station: '',
      bed: '',
      dataTest: [],
      submittedBlocks: [],
      submittedBeds: [],
      submittedStations: [],
      parentBlock: [],
      farmIssues: [],
    };
  }

  componentDidMount() {
    this.setState({
      personnel: this.props.personnel,
      personnelToken: this.props.personnelToken,
    });

    queryAllNewScouts(NEW_SCOUT_ISSUE)
      .then(farmIssues => {
        this.setState({
          farmIssues: farmIssues,
        });
      })
      .catch(error => {
        this.setState({
          farmIssues: [],
        });
      });
  }

  countBlockScout = () => {
    const {farmIssues} = this.state;

    const blocksScouted = farmIssues.map(blocks => {
      return blocks.block;
    });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var unique = blocksScouted.filter(onlyUnique);

    return unique.length;
  };

  countBedScout = () => {
    const {farmIssues} = this.state;
    const bedScouted = farmIssues.map(blocks => {
      return blocks.bed;
    });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var unique = bedScouted.filter(onlyUnique);

    return unique.length;
  };

  countStationScout = () => {
    const {farmIssues} = this.state;

    const bedScouted = farmIssues.map(blocks => {
      return blocks.entry;
    });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var unique = bedScouted.filter(onlyUnique);

    return unique.length;
  };

  countPointScout = () => {
    const {farmIssues} = this.state;

    const bedScouted = farmIssues.map(blocks => {
      return blocks.point;
    });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    var unique = bedScouted.filter(onlyUnique);

    return unique.length;
  };

  renderHeading = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
          style={styles.imageContainer}>
          <Image source={leftArrowImg} style={styles.imageHeight} />
        </TouchableOpacity>
        <Text style={styles.heading}>SYNC SCOUTING</Text>
      </View>
    );
  };

  syncScouting = () => {
    if (this.state.isLoading) return;

    this.setState({isLoading: true});

    const {farmIssues, personnel, personnelToken} = this.state;

    this.props.syncScouting(farmIssues, personnelToken);
  };

  renderLoader = () => {
    const {isLoading} = this.state;

    if (isLoading) {
      return <Loader />;
    } else {
      return null;
    }
  };

  render() {
    const {isLoading} = this.state;

    return (
      <Fragment>
        {this.renderLoader()}
        <View style={styles.container}>
          <View style={styles.header}>{this.renderHeading()}</View>
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <View style={styles.cardRowTitle}>
                  <Text style={styles.purpleText}>Blocks</Text>
                </View>

                <View style={styles.cardRowItem}>
                  <Image source={scouted} style={styles.image} />
                  <Text style={styles.blueText}>{this.countBlockScout()}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardRowTitle}>
                  <Text style={styles.purpleText}>Beds</Text>
                </View>

                <View style={styles.cardRowItem}>
                  <Image source={scouted} style={styles.image} />
                  <Text style={styles.blueText}>{this.countBedScout()}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardRowTitle}>
                  <Text style={styles.purpleText}>Stations</Text>
                </View>

                <View style={styles.cardRowItem}>
                  <Image source={scouted} style={styles.image} />
                  <Text style={styles.blueText}>
                    {this.countStationScout()}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardRowTitle}>
                  <Text style={styles.purpleText}>Points</Text>
                </View>

                <View style={styles.cardRowItem}>
                  <Image source={scouted} style={styles.image} />
                  <Text style={styles.blueText}>{this.countPointScout()}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonSubmit
              title="Sync Scouting"
              isLoading={isLoading}
              onPress={this.syncScouting}
            />
          </View>
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
    elevation: 6,
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
  buttonContainer: {
    margin: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: -1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderRadius: 100,
    zIndex: 99,
    backgroundColor: '#F035E0',
  },
  circle: {
    height: SIZE,
    width: SIZE,
    marginTop: -SIZE,
    borderRadius: 100,
    backgroundColor: '#F035E0',
  },
  image: {
    width: 24,
    height: 24,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#32485f',
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    borderColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#9e9e9e',
    flex: 1,
    alignItems: 'center',
    padding: 14,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  cardRowTitle: {
    width: '30%',
  },
  cardRowItem: {
    width: '35%',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  blueText: {
    fontSize: responsiveFontSize(2),
    color: '#2196F3',
    marginLeft: 10,
  },
  purpleText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  greyText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#9e9e9e',
  },
  cardBody: {
    color: '#32485f',
    padding: 14,
    paddingTop: 25,
  },
  cardRow: {
    flex: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: '#9e9e9e',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: 15,
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
