import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';
import moment from 'moment';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {AndroidBackHandler} from 'react-navigation-backhandler';

import RNPicker from 'rn-modal-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import {
  getIssueTypes,
  getIssues,
  getIssueCategories,
  addScoutIssue,
} from '../../actions/issueActions';
import {getBedPlant} from '../../actions/plantActions';

import {showError} from '../../utils';
import {ButtonSubmit, Loader} from '../common';
import {Actions} from 'react-native-router-flux';

import {
  pests,
  diseases,
  beneficials,
  others,
  pestsActive,
  diseasesActive,
  beneficialsActive,
  othersActive,
} from '../../images';

import {IssuePest, IssueDisease, IssueBeneficial, IssueOther} from './index';

import {
  queryAllIssues,
  queryAllIssueTypes,
  queryAllIssueCategories,
  createNewScout,
  queryAllBlocks,
  queryAllBeds,
  queryAllStations,
  queryAllPoints,
  // searchNewScout,
} from '../../models/Blocks';
import {NEW_SCOUT_ISSUE} from '../../models/schemas';

class Issues extends Component {
  state = {
    allDataCollected: [], // Populates selected issue type
    errors: '', // Captures redux errors
    currentPage: 1, // used for tab navigation
    checked: {}, // Stores checked issue
    categoriesChecked: {}, // Stores checked issue categories
    scoreValue: {}, // Stores checked scores
    isLoading: false, // Status of preloader
    radio_props: [
      {label: '1', value: 1},
      {label: '2', value: 2},
      {label: '3', value: 3},
      {label: '4', value: 4},
      {label: '5', value: 5},
    ],
    personnel: '', // Phone number of user
    plant: {}, // Plant details of selected bed
    personnelToken: '', // Token of the logged in user
    realmBlocks: [], // Used to populate dropdown list of blocks
    realmBeds: [], // Used to populate dropdown list of beds
    realmStations: [], // Used to populate dropdown list of stations
    realmPoints: [], // Used to populate dropdown list of points
    realmIssueTypes: [], // Used to populate list of issue types
    realmIssues: [], // Used to populate list of issues
    realmIssueCategories: [], // Used to populate list of issue categories
    selectedBlockValue: '', // Name of the selected block
    selectedSubBlockVlaue: '', // Name of the selected sub block
    selectedBedValue: '', // Name of the selected bed
    selectedStationLabel: '', // Name of the selected station
    selectedStationValue: 1,
    realmBlock: '', // Stores block id selected from drop down
    realmSubBlock: '', // Stores sub block id selected from drop down
    realmBed: '', // Stores bed id selected from drop down
    realmStation: 1, // Stores station id selected from drop down
    realmPoint: '', // Stores points id selected from drop down
    pointIndex: {}, // Highlights selected point radio
    filePath: '', // File to store data 0726149351-20200106.txt
    lastPointSelected: 0,
    // parentBlock: '',
    renderIssueLoader: false,
    preViousBed: '',
    checkIfBedisSelected: false,
  };

  _selectedBlockValue(index, name, id) {
    this.setState({
      realmBlock: id,
      realmSubBlock: '',
      realmBed: '',
      realmStation: '',
      realmPoint: '',
      pointIndex: {},
      selectedSubBlockValue: '',
      selectedBedValue: '',
      selectedStationLabel: '',
      selectedBlockValue: name,
      renderIssueLoader: false,
    });
  }

  _selectedSubBlockValue(index, name, id) {
    const {realmBlock, selectedStationValue} = this.state;
    console.log(id);

    if (realmBlock === '' || realmBlock === undefined) {
      showError('Error', 'Please select a block to continue', 'danger');
    } else {
      this.setState({
        realmSubBlock: id,
        realmBed: '',
        realmStation: '',
        realmPoint: '',
        selectedBedValue: '',
        selectedStationLabel: '',
        pointIndex: {},
        selectedSubBlockValue: name,
        renderIssueLoader: false,
      });
    }
  }

  _selectedBedValue(index, name, id) {
    const {realmSubBlock, selectedStationValue, realmBed} = this.state;
    if (realmSubBlock === '' || realmSubBlock === undefined) {
      showError('Error', 'Please select a sub_block to continue', 'danger');
    } else {
      this.setState({
        realmBed: id,
        selectedBedValue: name,
        renderIssueLoader: false,
        realmStation: 1,
        realmPoint: '',
        selectedStationLabel: '',
        pointIndex: {},
        selectedStationValue: 1,
        checkIfBedisSelected: true,
      });
      this.props.getBedPlant(id);
      // if (realmBed !== '' || realmBed !== undefined) {
      //   this._selectedStationValue(1, '', selectedStationValue);
      // }
    }
  }

  _selectedStationValue(index, name, id) {
    const {realmBed, realmStation} = this.state;
    console.log(id);

    if (realmBed === '' || realmBed === undefined) {
      showError('Error', 'Please select a bed to continue', 'danger');
    } else {
      this.setState({
        realmStation: id,
        selectedStationLabel: name,
        renderIssueLoader: false,
        realmPoint: '',
        pointIndex: {},
      });
    }

    // this.setState({
    //   realmStation: id,
    //   selectedStationLabel: name,
    //   renderIssueLoader: false,
    //   realmPoint: '',
    //   pointIndex: {},
    // });
  }

  selectePoint = (pointIdSelected, i) => {
    const {realmStation} = this.state;
    if (realmStation === '' || realmStation === undefined) {
      showError('Error', 'Please select a station to continue', 'danger');
    } else {
      this.setState({
        realmPoint: pointIdSelected,
        pointIndex: i,
        renderIssueLoader: true,
      });
    }
  };

  componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location ',
      },
    );
    const {personnel, personnelToken} = this.props;

    this.setState({
      personnel: personnel,

      filePath:
        RNFS.ExternalDirectoryPath +
        '/' +
        personnel +
        '-' +
        moment().format('YYYY') +
        moment().format('MM') +
        moment().format('DD') +
        '.txt',
      personnelToken: personnelToken,
    });

    queryAllBlocks()
      .then(realmBlocks => {
        this.setState({
          realmBlocks,
        });
      })
      .catch(error => {
        this.setState({
          realmBlocks: [],
        });
      });

    queryAllBeds().then(realmBeds => {
      this.setState({
        realmBeds,
      }).catch(error => {
        this.setState({
          realmBeds: [],
        });
      });
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
      .then(realmPoints => {
        this.setState({
          realmPoints,
          lastPointSelected: realmPoints.slice(-1)[0].id,
        });
      })
      .catch(error => {
        this.setState({
          realmPoints: [],
        });
      });

    queryAllIssues()
      .then(realmIssues => {
        this.setState({
          realmIssues,
        });
      })
      .catch(error => {
        this.setState({
          realmIssues: [],
        });
      });

    queryAllIssueTypes()
      .then(realmIssueTypes => {
        this.setState({
          realmIssueTypes,
        });
      })
      .catch(error => {
        this.setState({
          realmIssueTypes: [],
        });
      });

    queryAllIssueCategories()
      .then(realmIssueCategories => {
        this.setState({
          realmIssueCategories,
        });
      })
      .catch(error => {
        this.setState({
          realmIssueCategories: [],
        });
      });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.plant !== state.plant) {
      return {
        plant: props.plant,
      };
    }

    return null;
  }

  renderBlocks = () => {
    const {realmBlocks} = this.state;

    let allBlocks;

    if (realmBlocks.length > 0) {
      allBlocks = realmBlocks
        .filter(block => !block.block_parent)
        .map(block => ({
          id: block.id,
          name: block.block_name,
        }));
    } else {
      allBlocks = null;
    }

    return allBlocks;
  };

  renderSubBlocks = () => {
    const {realmBlock, realmBlocks} = this.state;

    let allBlocks;

    if (realmBlocks.length > 0) {
      allBlocks = realmBlocks
        .filter(block => block.block_parent === realmBlock)
        .map(block => ({id: block.id, name: block.block_name}));
    } else {
      allBlocks = null;
    }
    return allBlocks;
  };

  renderBeds = () => {
    const {realmSubBlock, realmBeds} = this.state;
    let allBeds;

    if (realmBeds.length > 0) {
      allBeds = realmBeds
        .filter(bed => bed.block_id === realmSubBlock)
        .map(bed => ({
          id: bed.id,
          name: bed.bed_name,
        }));
    } else {
      allBeds = null;
    }

    console.log(allBeds);

    return allBeds;
  };

  renderStations = () => {
    const {realmStations, realmBed} = this.state;

    let allStations;

    if (realmStations.length > 0) {
      allStations = realmStations.map(station => ({
        id: station.id,
        name: station.station_name,
      }));
    } else {
      allStations = null;
    }

    // this.setStationValueAndName(allStations);

    return allStations;
  };

  setIssue = (issueTypeId, IssueId) => {
    let {checked, categoriesChecked, allDataCollected, realmPoint} = this.state;

    checked[IssueId] = checked[IssueId] ? false : IssueId;
    let reportedIssue = {};
    let issueTypeFound = false;

    if (realmPoint === '' || realmPoint === undefined) {
      showError('Error', 'Please select a point to continue', 'danger');
    } else {
      // Check if issueType + issueId combination exists
      if (allDataCollected.length > 0) {
        let selectedIssueType;

        for (let f = 0; f < allDataCollected.length; f++) {
          selectedIssueType = allDataCollected[f];
          if (selectedIssueType.IssueType === issueTypeId) {
            issueTypeFound = true;

            let pestIssueExists = false;
            for (let r = 0; r < selectedIssueType.data.length; r++) {
              // We want to remove the pest
              if (!checked[IssueId]) {
                pestIssueExists = true;
                allDataCollected[f].data.splice(r, 1);
                categoriesChecked[IssueId] = false;
                break;
              }

              // Check if issue has already been added
              if (IssueId === selectedIssueType.data[r].Issue) {
                pestIssueExists = true;
                break;
              }
            }

            // Add issue if it does not exist
            if (!pestIssueExists) {
              const newIssue = {
                Issue: IssueId,
                IssueCategory: '',
                ScoreValue: '',
                date: moment().format(),
              };
              allDataCollected[f].data.push(newIssue);
            }

            break;
          }
        }
      }
      // We are submitting an issue for the first time
      if (!issueTypeFound) {
        reportedIssue['IssueType'] = issueTypeId;
        reportedIssue['data'] = [
          {
            Issue: IssueId,
            IssueCategory: '',
            ScoreValue: '',
            date: '',
          },
        ];
      }

      if (reportedIssue.IssueType) {
        allDataCollected.push(reportedIssue);
      }

      this.setState({
        checked,
        allDataCollected,
      });
    }
  };

  setIssueCategory = (issueType, issueCategoryId, IssueId) => {
    let {categoriesChecked, allDataCollected} = this.state;

    let issueExists = false;

    // Check if issueType + issueId combination exists
    if (allDataCollected.length > 0) {
      for (f = 0; f < allDataCollected.length; f++) {
        let selectedIssueType = allDataCollected[f];
        if (selectedIssueType.IssueType === issueType) {
          for (let r = 0; r < selectedIssueType.data.length; r++) {
            // Check if issue has already been added
            if (IssueId === selectedIssueType.data[r].Issue) {
              allDataCollected[f].data[r].IssueCategory = issueCategoryId;
              issueExists = true;
              break;
            }
          }
        }
      }

      if (!issueExists) {
        showError('Error', 'Please select an issue to continue', 'danger');
      } else {
        categoriesChecked[IssueId] = issueCategoryId;
      }
    } else {
      showError('Error', 'Please select an issue to continue', 'danger');
    }

    this.setState({
      allDataCollected,
      categoriesChecked,
    });
  };

  setIssueValue = (issueType, value, IssueId) => {
    let {scoreValue, allDataCollected} = this.state;
    scoreValue[IssueId] = value;

    let issueExists = false;

    // Check if issueType + issueId combination exists
    if (allDataCollected.length > 0) {
      for (f = 0; f < allDataCollected.length; f++) {
        let selectedIssueType = allDataCollected[f];
        if (selectedIssueType.IssueType === issueType) {
          for (let r = 0; r < selectedIssueType.data.length; r++) {
            // Check if issue has already been added
            if (IssueId === selectedIssueType.data[r].Issue) {
              allDataCollected[f].data[r].ScoreValue = value;
              allDataCollected[f].data[r].date = moment().format();
              issueExists = true;
              break;
            }
          }
        }
      }

      if (!issueExists) {
        showError('Error', 'Please select a pest to continue', 'danger');
      } else {
        scoreValue[IssueId] = value;
      }
    } else {
      showError('Error', 'Please select a pest to continue', 'danger');
    }

    this.setState({
      allDataCollected,
      scoreValue,
    });
  };

  setIssueCategoryAndValue = (issueType, value, IssueId, issueCategoryId) => {
    let {scoreValue, allDataCollected, categoriesChecked} = this.state;

    let issueExists = false;

    // Check if issueType + issueId combination exists
    if (allDataCollected.length > 0) {
      for (f = 0; f < allDataCollected.length; f++) {
        let selectedIssueType = allDataCollected[f];

        if (selectedIssueType.IssueType === issueType) {
          for (let r = 0; r < selectedIssueType.data.length; r++) {
            // Check if issue has already been added
            if (IssueId === selectedIssueType.data[r].Issue) {
              scoreValue[IssueId] = value;
              categoriesChecked[IssueId] = issueCategoryId;
              allDataCollected[f].data[r].ScoreValue = value;
              allDataCollected[f].data[r].IssueCategory = issueCategoryId;
              allDataCollected[f].data[r].date = moment().format();
              issueExists = true;
              break;
            }
          }
        }
      }

      if (!issueExists) {
        showError('Error', 'Please select an issue to continue', 'danger');
      } else {
        scoreValue[IssueId] = value;
      }
    } else {
      showError('Error', 'Please select an issue to continue', 'danger');
    }

    this.setState({
      allDataCollected,
      scoreValue,
      categoriesChecked,
    });
  };

  setIssueValueWithoutCategory = (issueType, value, IssueId) => {
    let {scoreValue, allDataCollected} = this.state;

    let issueExists = false;

    // Check if issueType + issueId combination exists
    if (allDataCollected.length > 0) {
      for (f = 0; f < allDataCollected.length; f++) {
        let selectedIssueType = allDataCollected[f];

        if (selectedIssueType.IssueType === issueType) {
          for (let r = 0; r < selectedIssueType.data.length; r++) {
            // Check if issue has already been added
            if (IssueId === selectedIssueType.data[r].Issue) {
              scoreValue[IssueId] = value;
              allDataCollected[f].data[r].ScoreValue = value;
              allDataCollected[f].data[r].date = moment().format();
              issueExists = true;
              break;
            }
          }
        }
      }

      if (!issueExists) {
        showError('Error', 'Please select an issue to continue', 'danger');
      } else {
        scoreValue[IssueId] = value;
      }
    } else {
      showError('Error', 'Please select an issue to continue', 'danger');
    }

    this.setState({
      allDataCollected,
      scoreValue,
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

  submitIssue = event => {
    // event.preventDefault();
    if (this.state.isLoading) return;

    this.setState({isLoading: false});

    const {
      realmBlock,
      realmBed,
      realmStation,
      realmPoint,
      plant,
      personnel,
      allDataCollected,
      filePath,
      selectedStationValue,
      lastPointSelected,
    } = this.state;

    if (
      allDataCollected.length > 0 &&
      realmPoint !== 'undefined' &&
      realmPoint !== ''
    ) {
      let promises = [];
      let id = Math.floor(Date.now() / 1000);

      Geolocation.getCurrentPosition(
        position => {
          for (let r = 0; r < allDataCollected.length; r++) {
            const currentScout = allDataCollected[r];
            const issueType = currentScout.IssueType;
            const issueTypeData = currentScout.data;

            if (issueTypeData.length > 0) {
              for (let s = 0; s < issueTypeData.length; s++) {
                const currentIssueTypeData = issueTypeData[s];
                const issue = currentIssueTypeData.Issue;
                const issueCategory = currentIssueTypeData.IssueCategory;
                const value = currentIssueTypeData.ScoreValue;
                const date = currentIssueTypeData.date;

                id = id + 1;
                // console.log(position.coords.longitude);
                const data = {
                  // id: id,
                  block: realmBlock,
                  bed: realmBed,
                  entry: realmStation,
                  point: realmPoint,
                  personnel: personnel,
                  date: date,
                  issue_type: issueType,
                  issue: issue,
                  issue_category: issueCategory,
                  value: Number.isInteger(value) ? value : parseInt(value),
                  plant: plant.id,
                  variety: plant.variety,
                  longitude: position.coords.longitude.toString(),
                  latitude: position.coords.latitude.toString(),
                };
                // console.log(data);
                // promises.push(
                //   createNewScout(data, NEW_SCOUT_ISSUE)
                //     .then(() => {})
                //     .catch(error => {
                //       console.log(error);
                //     }),
                // );
                // promises.push(
                //   // append the file
                //   RNFS.appendFile(filePath, JSON.stringify(data) + ',', 'utf8')
                //     .then(success => {
                //       console.log('FILE WRITTEN!');
                //     })
                //     .catch(err => {
                //       console.log(err.message);
                //     }),
                // );

                // TRIAL WITHOUT THE PUSH
                RNFS.appendFile(filePath, JSON.stringify(data) + ',', 'utf8')
                  .then(success => {
                    console.log('FILE WRITTEN!');
                  })
                  .catch(err => {
                    console.log(err.message);
                  });
                // END OF TRIAL

                // this.setState({isLoading: true});
              }
            }
          }

          if (realmPoint === lastPointSelected) {
            Promise.all(promises)
              .then(() => {
                this.setState({
                  // realmBlock: '',
                  // realmSubBlock: '',
                  // realmBed: '',
                  selectedStationValue: selectedStationValue + 1,
                  realmPoint: '',
                  isLoading: false,
                  pointIndex: {},
                  checked: {},
                  categoriesChecked: {},
                  scoreValue: {},
                  allDataCollected: [],
                  renderIssueLoader: false,
                });
                showError('Success', 'Data Submitted Successfully', 'success');
              })
              .catch(err => {
                showError('Error', err.message, 'danger');
              });
          } else {
            Promise.all(promises)
              .then(() => {
                this.setState({
                  // realmBlock: '',
                  // realmSubBlock: '',
                  // realmBed: '',
                  selectedStationValue: selectedStationValue,
                  realmPoint: '',
                  isLoading: false,
                  pointIndex: {},
                  checked: {},
                  categoriesChecked: {},
                  scoreValue: {},
                  allDataCollected: [],
                  renderIssueLoader: false,
                });
                showError('Success', 'Data Submitted Successfully', 'success');
              })
              .catch(err => {
                showError('Error', err.message, 'danger');
              });
          }

          // Promise.all(promises)
          //   .then(() => {
          //     this.setState({
          //       // realmBlock: '',
          //       // realmSubBlock: '',
          //       // realmBed: '',
          //       selectedStationValue: selectedStationValue + 1,
          //       realmPoint: '',
          //       isLoading: false,
          //       pointIndex: {},
          //       checked: {},
          //       categoriesChecked: {},
          //       scoreValue: {},
          //     });
          //     showError('Success', 'Data Submitted Successfully', 'success');
          //   })
          //   .catch(err => {
          //     showError('Error', err.message, 'danger');
          //   });
        },
        err => {
          console.error(err);
          showError('Error', err.message, 'danger');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 3000},
      );
    } else {
      showError(
        'Error',
        'No scouting done. Please scout and try again',
        'danger',
      );
    }
  };
  componentWillUnmount() {
    Geolocation.stopObserving();
  }

  setCurrentPage = currentPage => {
    this.setState({currentPage});
  };

  noIssueFound = () => {
    const {
      realmStation,
      selectedStationValue,
      realmPoint,
      lastPointSelected,
    } = this.state;
    if (realmPoint === '' || realmPoint === 'undefined') {
      showError('Error', 'Select a point to continue', 'danger');
    } else {
      if (realmPoint === lastPointSelected) {
        this.setState({
          selectedStationValue: selectedStationValue + 1,
        });
      }

      showError(
        'Success',
        'No Issue Found on point of selected Station',
        'success',
      );
    }
  };

  render() {
    const {
      currentPage,
      checked,
      categoriesChecked,
      scoreValue,
      radio_props,
      isLoading,
      realmIssues,
      realmIssueTypes,
      realmIssueCategories,
      personnel,
      personnelToken,
      realmPoints,
      selectedBlockValue,
      selectedSubBlockValue,
      selectedBedValue,
      pointIndex,
      renderIssueLoader,
      selectedStationValue,
      realmStations,
      realmBed,
      checkIfBedisSelected,
    } = this.state;

    let stationName;
    if (checkIfBedisSelected) {
      if (realmBed === '' || realmBed === undefined) {
        () => this._selectedStationValue(1, '', selectedStationValue);
      }
      stationName = realmStations
        .filter(stn => stn.id === selectedStationValue)
        .map(station => station.station_name);
    }

    const pestsPage =
      realmIssueTypes.length > 0 &&
      realmIssues.length > 0 &&
      realmIssueCategories.length > 0 ? (
        <IssuePest
          realmIssueTypes={realmIssueTypes}
          realmIssues={realmIssues}
          realmIssueCategories={realmIssueCategories}
          setIssue={this.setIssue}
          setIssueCategory={this.setIssueCategory}
          setIssueValue={this.setIssueValue}
          checked={checked}
          categoriesChecked={categoriesChecked}
          scoreValue={scoreValue}
          setIssueCategoryTest={this.setIssueCategoryTest}
        />
      ) : null;

    const diseasesPage =
      realmIssueTypes.length > 0 &&
      realmIssues.length > 0 &&
      realmIssueCategories.length > 0 ? (
        <IssueDisease
          realmIssueTypes={realmIssueTypes}
          realmIssues={realmIssues}
          realmIssueCategories={realmIssueCategories}
          setIssue={this.setIssue}
          setIssueCategory={this.setIssueCategory}
          setIssueCategoryAndValue={this.setIssueCategoryAndValue}
          checked={checked}
          categoriesChecked={categoriesChecked}
          scoreValue={scoreValue}
          radio_props={radio_props}
        />
      ) : null;

    const beneficialsPage =
      realmIssueTypes.length > 0 && realmIssues.length > 0 ? (
        <IssueBeneficial
          realmIssueTypes={realmIssueTypes}
          realmIssues={realmIssues}
          setIssue={this.setIssue}
          setIssueValueWithoutCategory={this.setIssueValueWithoutCategory}
          checked={checked}
          scoreValue={scoreValue}
          radio_props={radio_props}
        />
      ) : null;

    const othersPage =
      realmIssueTypes.length > 0 && realmIssues.length > 0 ? (
        <IssueOther
          realmIssueTypes={realmIssueTypes}
          realmIssues={realmIssues}
          setIssue={this.setIssue}
          setIssueValueWithoutCategory={this.setIssueValueWithoutCategory}
          checked={checked}
          scoreValue={scoreValue}
          radio_props={radio_props}
        />
      ) : null;

    return (
      <AndroidBackHandler
        onBackPress={() => {
          Actions.scoutList({
            personnel: personnel,
            personnelToken: personnelToken,
          });
        }}>
        <View style={styles.wholeContainer}>
          {this.renderLoader()}
          <View style={styles.topSection}>
            <View style={styles.forHeading}>
              <Text style={styles.textHeading}>Block</Text>
              <Text style={styles.textHeading}>Sub Block</Text>
              <Text style={styles.textHeading}>Bed</Text>
              <Text style={styles.textHeading}>Station</Text>
            </View>
            <View style={styles.fourPickers}>
              <RNPicker
                dataSource={this.renderBlocks()}
                dummyDataSource={this.renderBlocks()}
                defaultValue={false}
                selectedLabel={selectedBlockValue}
                pickerTitle={'Select Block'}
                showSearchBar={true}
                disablePicker={false}
                changeAnimation={'none'}
                searchBarPlaceHolder={'Search.....'}
                showPickerTitle={true}
                searchBarContainerStyle={styles.searchBarContainerStyle}
                pickerStyle={styles.pickerStyle}
                selectLabelTextStyle={styles.selectLabelTextStyle}
                selectedValue={(index, name, id) =>
                  this._selectedBlockValue(index, name, id)
                }
              />
              <RNPicker
                dataSource={this.renderSubBlocks()}
                dummyDataSource={this.renderSubBlocks()}
                defaultValue={false}
                selectedLabel={selectedSubBlockValue}
                pickerTitle={'Select Sub Block'}
                showSearchBar={true}
                disablePicker={false}
                changeAnimation={'none'}
                searchBarPlaceHolder={'Search.....'}
                showPickerTitle={true}
                searchBarContainerStyle={styles.searchBarContainerStyle}
                pickerStyle={styles.pickerStyle}
                selectLabelTextStyle={styles.selectLabelTextStyle}
                selectedValue={(index, name, id) =>
                  this._selectedSubBlockValue(index, name, id)
                }
              />
              <RNPicker
                dataSource={this.renderBeds()}
                dummyDataSource={this.renderBeds()}
                defaultValue={false}
                selectedLabel={selectedBedValue}
                pickerTitle={'Select Bed'}
                showSearchBar={true}
                disablePicker={false}
                changeAnimation={'none'}
                searchBarPlaceHolder={'Search.....'}
                showPickerTitle={true}
                searchBarContainerStyle={styles.searchBarContainerStyle}
                pickerStyle={styles.pickerStyle}
                selectLabelTextStyle={styles.selectLabelTextStyle}
                selectedValue={(index, name, id) =>
                  this._selectedBedValue(index, name, id)
                }
              />
              <RNPicker
                dataSource={this.renderStations()}
                dummyDataSource={this.renderStations()}
                defaultValue={selectedStationValue}
                selectedLabel={stationName}
                pickerTitle={'Select Station'}
                showSearchBar={true}
                disablePicker={false}
                changeAnimation={'none'}
                searchBarPlaceHolder={'Search.....'}
                showPickerTitle={true}
                searchBarContainerStyle={styles.searchBarContainerStyle}
                pickerStyle={styles.pickerStyle}
                selectLabelTextStyle={styles.selectLabelTextStyle}
                selectedValue={(index, name, id) =>
                  this._selectedStationValue(index, name, id)
                }
              />
            </View>

            <RadioForm
              formHorizontal={true}
              animation={true}
              style={styles.radioStyle}
              buttonColor={'#2196f3'}>
              {realmPoints.map((cat, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={{label: cat.point_name, value: cat.id}}
                    index={i}
                    isSelected={pointIndex === i ? true : false}
                    onPress={value => this.selectePoint(value, i)}
                    borderWidth={1}
                    buttonInnerColor={'#2196f3'}
                    buttonOuterColor={'#2196f3'}
                    buttonSize={10}
                    buttonOuterSize={20}
                    buttonStyle={{}}
                    buttonWrapStyle={{marginLeft: 10}}
                  />
                  <RadioButtonLabel
                    obj={{label: cat.point_name, value: cat.id}}
                    index={i}
                    labelHorizontal={true}
                    onPress={value => this.selectePoint(value, i)}
                    labelStyle={{fontSize: 14, color: '#2196f3'}}
                    labelWrapStyle={{marginLeft: -4}}
                  />
                </RadioButton>
              ))}
              <TouchableOpacity
                style={styles.okButton}
                onPress={this.noIssueFound}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </RadioForm>
          </View>
          <View style={renderIssueLoader ? styles.show : styles.hide}>
            <View style={styles.tabHead}>
              <TouchableOpacity
                style={styles.tabNav}
                onPress={() => {
                  this.setCurrentPage(1);
                }}>
                <Image
                  source={currentPage === 1 ? pestsActive : pests}
                  style={styles.imageHeight}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabNav}
                onPress={() => {
                  this.setCurrentPage(2);
                }}>
                <Image
                  source={currentPage === 2 ? diseasesActive : diseases}
                  style={styles.imageHeight}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabNav}
                onPress={() => {
                  this.setCurrentPage(3);
                }}>
                <Image
                  source={currentPage === 3 ? beneficialsActive : beneficials}
                  style={styles.imageHeight}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabNav}
                onPress={() => {
                  this.setCurrentPage(4);
                }}>
                <Image
                  source={currentPage === 4 ? othersActive : others}
                  style={styles.imageHeight}
                />
              </TouchableOpacity>
            </View>

            {currentPage === 1
              ? pestsPage
              : currentPage === 2
              ? diseasesPage
              : currentPage === 3
              ? beneficialsPage
              : currentPage === 4
              ? othersPage
              : null}

            <View style={styles.buttonContainer}>
              <ButtonSubmit
                title="SUBMIT"
                isLoading={isLoading}
                onPress={this.submitIssue}
              />
            </View>
          </View>
        </View>
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  wholeContainer: {
    height: '64%',
  },
  topSection: {
    backgroundColor: '#ffffff',
    // height: responsiveHeight(16),
    marginBottom: 0,
    flexDirection: 'column',
    paddingTop: 4,
    paddingRight: 10,
  },

  fourPickers: {
    flexDirection: 'row',
    width: responsiveWidth(100),
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingLeft: 26,
  },

  forHeading: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  textHeading: {
    fontSize: responsiveFontSize(1.4),
    color: '#9C27B0',
    width: '16%',
    textAlign: 'left',
  },

  radioStyle: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },

  searchBarContainerStyle: {
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 10,
  },
  pickerStyle: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    width: '50%',
  },
  selectLabelTextStyle: {
    color: '#2196f3',
    fontSize: responsiveFontSize(1.6),
    paddingLeft: 4,
    textAlign: 'left',
    width: '100%',
    alignSelf: 'center',
  },

  tabHead: {
    backgroundColor: '#0971CE',
    width: '100%',
    height: responsiveHeight(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2000,
  },
  tabNav: {
    width: responsiveWidth(25),
    alignItems: 'center',
  },

  imageHeight: {
    height: 20,
    width: 20,
  },

  input: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: '30%',
    paddingLeft: responsiveWidth(2),
    color: '#2196f3',
    fontSize: responsiveFontSize(1.6),
  },
  radioInputs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  okButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    height: 20,
    borderRadius: 4,
    zIndex: 100,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1.8,
    elevation: 2,
    width: 50,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

Issues.propTypes = {
  getIssueTypes: PropTypes.func.isRequired,
  getBedPlant: PropTypes.func.isRequired,
  getIssues: PropTypes.func.isRequired,
  getIssueCategories: PropTypes.func.isRequired,
  addScoutIssue: PropTypes.func.isRequired,
  errors: PropTypes.string,
};

const mapStateToProps = state => ({
  plant: state.plants.plant,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getBedPlant,
  getIssueTypes,
  getIssues,
  getIssueCategories,
  addScoutIssue,
})(Issues);
