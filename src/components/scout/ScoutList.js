import React, {PureComponent, Fragment} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Easing,
  Animated,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
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
import moment from 'moment';

import {Loader} from '../common';

import {fetchAppData} from '../../actions/dataActions';
import {fetchScout} from '../../actions/scoutActions';

import {fetchBlocks} from '../../actions/blockActions';
import {fetchBeds} from '../../actions/bedActions';
import {getStations} from '../../actions/stationActions';
import {getPoints} from '../../actions/pointActions';
import {
  getIssues,
  getIssueCategories,
  getIssueTypes,
} from '../../actions/issueActions';

import {createNewScout, searchNewScout} from '../../models/Blocks';
import {NEW_SCOUT_SESSION} from '../../models/schemas';

const SIZE = 40;

class ScoutList extends PureComponent {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      scoutList: {},
      errors: {},
      jwtToken: '',
      appData: false,
      growAnimated: new Animated.Value(0),
      scout: {},
      personnel: '',
      personnelToken: {},
      buttonActions: [
        {
          text: 'Sync',
          icon: require('../../images/cloud-upload.png'),
          name: 'bt_sync',
          position: 1,
          color: '#2196F3',
        },

        {
          text: 'Scout',
          icon: require('../../images/scout-icon.png'),
          name: 'bt_scout',
          position: 4,
          color: '#2196F3',
        },
        {
          text: 'Refresh',
          icon: require('../../images/refresh.png'),
          name: 'bt_refresh',
          position: 2,
          color: '#2196F3',
        },
      ],
    };
  }

  componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'BloomCare Location Permission',
        message: 'BloomCare App needs access to your location ',
      },
    );

    this.props.fetchBlocks();
    this.props.fetchBeds();
    this.props.getStations();
    this.props.getPoints();
    this.props.getIssues();
    this.props.getIssueTypes();
    this.props.getIssueCategories();
    this.props.fetchScout();

    this.setState({
      isLoading: false,
      personnel: this.props.personnel,
      personnelToken: this.props.personnelToken,
    });

    getData = async key => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null || value === false) {
          this.props.fetchAppData();
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData('@appDataFetched');
  }

  static getDerivedStateFromProps(props, state) {
    // if (props.appData !== state.appData) {
    //   state.growAnimated.setValue(0);
    //   return {
    //     isLoading: false,
    //   };
    // }

    if (props.scout !== state.scout) {
      // console.log(props.scout);
      return {
        scout: props.scout,
        isLoading: false,
      };
    }

    if (props.errors !== state.errors) {
      return {
        errors: props.errors,
      };
    }

    return null;
  }

  createScoutSession = () => {
    const id = Math.floor(Date.now() / 1000);
    const status = 1;
    const {personnel, personnelToken} = this.state;
    const data = {
      id: id,
      personnel: personnel,
      status: status,
      created: moment().format(),
    };

    searchNewScout(
      'status = 1 AND personnel = "' + personnel + '"',
      NEW_SCOUT_SESSION,
    ).then(session => {
      if (session.length === 0) {
        createNewScout(data, NEW_SCOUT_SESSION)
          .then(() => {
            Actions.issues({
              personnel: personnel,
              session: id,
              personnelToken: personnelToken,
            });
          })
          .catch(error => {
            alert(`insert new Scout error ${error}`);
          });
      } else {
        Actions.issues({
          personnel: personnel,
          session: session[0].id,
          personnelToken: personnelToken,
        });
      }
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

  refreshHistory = () => {
    this.setState({
      isLoading: false,
      personnel: this.props.personnel,
      personnelToken: this.props.personnelToken,
    });
    getData = async key => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null || value === false) {
          this.props.fetchAppData();
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData('@appDataFetched');

    this.props.fetchScout();
  };

  showBlocks = () => {
    const {showDates, showBlocks} = this.state;
    this.setState({
      showDates: false,
      showBlocks: true,
    });
  };

  backToDates = () => {
    const {showDates, showBlocks} = this.state;
    this.setState({
      showDates: true,
      showBlocks: false,
    });
  };

  renderScoutList = ({item}) => {
    // console.log(item);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {moment(item.date).format('DD/MM/YYYY')}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardRow3}>
            <View style={styles.rowItem3}>
              <Text style={styles.greyText}> Block: </Text>
              <Text style={styles.blueText}>
                {item.plant.bed.block.parent.name}
              </Text>
            </View>
            <View style={styles.rowItem3}>
              <Text style={styles.greyText}> Sub Block: </Text>
              <Text style={styles.blueText}>{item.plant.bed.block.name}</Text>
            </View>
            <View style={styles.rowItem3}>
              <Text style={styles.greyText}> Bed: </Text>
              <Text style={styles.blueText}> {item.plant.bed.bed_name} </Text>
            </View>
          </View>
          <View style={styles.cardRow2}>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Station: </Text>
              <Text style={styles.blueText}> {item.entry.name} </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Point: </Text>
              <Text style={styles.blueText}> {item.point.name} </Text>
            </View>
          </View>
          <View style={styles.cardRow2}>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Variety: </Text>
              <Text style={styles.blueText}> {item.plant.variety.name} </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Issue Type: </Text>
              <Text style={styles.blueText}>{item.issue.issue_type.name}</Text>
            </View>
          </View>
          <View style={styles.cardRow2}>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Issue: </Text>
              <Text style={styles.blueText}>{item.issue.issue_name}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Category: </Text>
              <Text style={styles.blueText}>
                {item.issueCategory && item.issueCategory.name}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow2Btm}>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Scoring: </Text>
              <Text style={styles.blueText}>{item.issue.score.name}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.greyText}> Value: </Text>
              <Text style={styles.blueText}>{item.value}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  forwardPage = name => {
    Actions.blocks();
  };

  render() {
    const {
      scout,
      growAnimated,
      buttonActions,
      showBlocks,
      personnel,
      personnelToken,
    } = this.state;

    let allscout;

    if (scout) {
      if (scout.items) {
        allscout = scout.items;
      } else {
        allscout = null;
      }
    } else {
      allscout = null;
    }

    const changeScale = growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, SIZE],
    });

    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.heading}> HISTORY </Text>
        </View> */}
        {showBlocks && (
          <TouchableOpacity onPress={this.backToDates}>
            <Text> Back to Dates </Text>
          </TouchableOpacity>
        )}
        {this.renderLoader()}
        {
          <Image
            style={styles.image}
            source={require('../../images/landing.jpg')}
          />
          /* <FlatList
          data={allscout}
          renderItem={this.renderScoutList}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        /> */
        }
        <FloatingAction
          color="#2196F3"
          actions={buttonActions}
          onPressItem={name => {
            if (name === 'bt_sync') {
              Actions.sync({
                personnel,
                personnelToken,
              });
            } else if (name === 'bt_refresh') {
              this.refreshHistory();
            } else {
              this.createScoutSession();
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 20,
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  // header: {
  //   backgroundColor: '#ffffff',
  //   height: 40,
  //   elevation: 6,
  //   marginBottom: 0,
  //   justifyContent: 'center',
  // },
  // heading: {
  //   color: '#9C27B0',
  //   fontWeight: 'bold',
  //   fontSize: responsiveFontSize(2),
  //   fontFamily: 'Gill Sans',
  //   textAlign: 'center',
  // },
  buttonContainer: {
    margin: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    resizeMode: 'cover',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: responsiveFontSize(1.8),
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
    color: '#6f7e8f',
  },
  cardTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  cardRowTitle: {
    width: 90,
  },
  blueText: {
    fontSize: responsiveFontSize(1.6),
    color: '#2196F3',
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
    padding: 12,
    paddingTop: 6,
  },
  cardRow3: {
    flex: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: '#9e9e9e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 5,
  },
  cardRow2: {
    flex: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: '#C9C9C9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 5,
  },
  cardRow2Btm: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem3: {
    flexDirection: 'row',
  },
  rowItem: {
    flexDirection: 'row',
    width: '46%',
  },
});

ScoutList.propTypes = {
  fetchAppData: PropTypes.func.isRequired,
  appData: PropTypes.bool.isRequired,
  fetchScout: PropTypes.func.isRequired,
  // scout: PropTypes.object.isRequired,
  personnel: PropTypes.string,
  // errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appData: state.data.appData,
  scout: state.scout.scout,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  fetchAppData,
  fetchScout,
  fetchBeds,
  fetchBlocks,
  getStations,
  getPoints,
  getIssues,
  getIssueCategories,
  getIssueTypes,
})(ScoutList);
