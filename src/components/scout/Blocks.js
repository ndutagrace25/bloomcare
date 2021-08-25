import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StyleSheet,
  Picker,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import RNPicker from 'rn-modal-picker';
import Dimensions from 'Dimensions';

// import {createNewScout} from '../../actions/scoutActions';
import {fetchBlocks, insertNewBlock} from '../../actions/blockActions';
import {
  queryAllBlocks,
  queryAllBeds,
  createNewScout,
  queryAllNewScouts,
  searchNewScout,
} from '../../models/Blocks';
import {NEW_SCOUT_BLOCK, NEW_SCOUT_BED} from '../../models/schemas';
import {fetchBeds} from '../../actions/bedActions';

import {ButtonSubmit} from '../common';
import {leftArrowImg} from '../../images';
import moment from 'moment';

class Blocks extends PureComponent {
  constructor() {
    super();

    this.state = {
      blocks: [],
      beds: [],
      parentBlock: '',
      block: '',
      bed: '',
      newScout: '',
      isLoading: false,
      placeHolderText: '----Select Bed----',
      selectedValue: '',
      personnel: '',
      session: '',
      realmBlocks: [],
      realmBeds: [],
      realmNewScout: [],
      personnelToken: '',
    };
  }

  _selectedValue(index, name, id) {
    this.setState({
      bed: id,
      selectedValue: name,
    });
  }
  // _selectedValue(index, name) {
  //     this.setState({ selectedValue: name });
  //   }

  componentDidMount() {
    const {personnel, session, personnelToken} = this.props;
    this.setState({
      personnel,
      session,
      personnelToken,
    });
    // this.props.fetchBlocks();
    // this.props.fetchBeds();
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

    queryAllNewScouts().then(realmNewScout => {
      this.setState({
        realmNewScout,
      }).catch(error => {
        this.setState({
          realmNewScout: [],
        });
      });
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.blocks !== state.blocks) {
      return {
        blocks: props.blocks,
      };
    }

    if (props.beds !== state.beds) {
      return {
        beds: props.beds,
      };
    }

    return null;
  }

  selectBed = isLoading => {
    if (this.state.isLoading) return;

    this.setState({
      isLoading: true,
    });

    const {block, bed, personnel, session, personnelToken} = this.state;

    const _id = Math.floor(Date.now() / 1000);
    // const {session} = this.props;

    const dataBlock = {
      _id: _id,
      session: session,
      block: block,
      created: moment().format(),
    };

    const dataBed = {
      _id: _id,
      block: _id,
      bed: bed,
      created: moment().format(),
    };

    searchNewScout(
      'session = "' + session + '" AND block = "' + block + '"',
      NEW_SCOUT_BLOCK,
    ).then(scoutBlock => {
      if (scoutBlock.length === 0) {
        createNewScout(dataBlock, NEW_SCOUT_BLOCK)
          .then(() => {
            createNewScout(dataBed, NEW_SCOUT_BED)
              .then(() => {
                Actions.stations({
                  personnel: personnel,
                  currentBlock: block,
                  currentBed: bed,
                  bedId: _id,
                  session: session,
                  blockRealm: _id,
                  personnelToken: personnelToken,
                });
              })
              .catch(error => {
                alert(`insert new bed error ${error}`);
              });
          })
          .catch(error => {
            alert(`insert new block error ${error}`);
          });
      } else {
        searchNewScout(
          'bed = "' + bed + '" AND block = "' + scoutBlock[0]._id + '"',
          NEW_SCOUT_BED,
        ).then(scoutBed => {
          Actions.stations({
            personnel: personnel,
            currentBlock: block,
            currentBed: bed,
            bedId: _id,
            session: session,
            blockRealm: _id,
            personnelToken: personnelToken,
          });
        });
      }
    });
  };

  renderBlocks = () => {
    const {blocks, realmBlocks} = this.state;

    let allBlocks;

    if (realmBlocks.length > 0) {
      allBlocks = realmBlocks
        .filter(block => !block.parent)
        .map(block => (
          <Picker.Item label={block.name} value={block._id} key={block._id} />
        ));
    } else {
      allBlocks = null;
    }

    return allBlocks;
  };

  renderSubBlocks = () => {
    const {parentBlock, blocks, realmBlocks} = this.state;

    let allBlocks;

    if (realmBlocks.length > 0) {
      allBlocks = realmBlocks
        .filter(block => block.parent === parentBlock)
        .map(block => (
          <Picker.Item label={block.name} value={block._id} key={block._id} />
        ));
    } else {
      allBlocks = null;
    }

    return allBlocks;
  };

  renderBeds = () => {
    const {beds, block, realmBeds} = this.state;

    let allBeds;

    if (realmBeds.length > 0) {
      allBeds = realmBeds
        .filter(bed => bed.block === block)
        .map(bed => ({
          id: bed._id,
          name: bed.bed_name,
        }));
    } else {
      allBeds = null;
    }

    return allBeds;
  };

  render() {
    const {
      parentBlock,
      block,
      bed,
      isLoading,
      selectedValue,
      placeHolderText,
      personnel,
      // realmBlocks,
      // realmBeds,
      realmNewScout,
      personnelToken,
    } = this.state;

    // const newBlockAdded = realmNewScout.map(block => {
    //   return block.block;
    // });

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Actions.scoutList({
                personnel,
                personnelToken,
              });
            }}
            style={styles.imageContainer}>
            <Image source={leftArrowImg} style={styles.imageHeight} />
          </TouchableOpacity>
          <Text style={styles.heading}> SELECT BED </Text>
        </View>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.bodyContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={parentBlock}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    parentBlock: itemValue,
                  })
                }>
                <Picker.Item label="----Select Block----" value="" />
                {this.renderBlocks()}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={block}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    block: itemValue,
                  })
                }>
                <Picker.Item label="----Select Sub Block----" value="" />
                {this.renderSubBlocks()}
              </Picker>
            </View>
            <RNPicker
              dataSource={this.renderBeds()}
              dummyDataSource={this.renderBeds()}
              defaultValue={false}
              pickerTitle={'Select Bed'}
              showSearchBar={true}
              disablePicker={false}
              changeAnimation={'none'}
              searchBarPlaceHolder={'Search.....'}
              showPickerTitle={true}
              selectedLabel={selectedValue}
              placeHolderLabel={placeHolderText}
              searchBarContainerStyle={styles.searchBarContainerStyle}
              pickerStyle={styles.pickerStyle}
              selectLabelTextStyle={styles.selectLabelTextStyle}
              placeHolderTextStyle={styles.placeHolderTextStyle}
              dropDownImageStyle={styles.dropDownImageStyle}
              dropDownImage={leftArrowImg}
              selectedValue={(index, name, id) =>
                this._selectedValue(index, name, id)
              }
            />
            <View style={styles.buttonContainer}>
              <ButtonSubmit
                title="PROCEED"
                isLoading={isLoading}
                onPress={this.selectBed}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
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
  itemContainer: {
    marginBottom: 30,
  },
  bodyContainer: {
    paddingTop: 40,
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
  pickerContainer: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  picker: {
    color: '#2196f3',
  },
  backView: {
    marginTop: 20,
    flex: 0,
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    color: '#ffffff',
  },

  searchBarContainerStyle: {
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 40,
  },
  pickerStyle: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 40,
    paddingRight: 25,
    marginLeft: 38,
    marginRight: 26,
  },
  selectLabelTextStyle: {
    flexDirection: 'row',
    color: '#2196f3',
    padding: 10,
    textAlign: 'left',
    alignSelf: 'center',
    width: '100%',
  },
  placeHolderTextStyle: {
    flexDirection: 'row',
    color: '#2196f3',
    padding: 10,
    textAlign: 'left',
    alignSelf: 'center',
    width: '100%',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 12,
    height: 6,
    alignSelf: 'center',
  },

  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
});

Blocks.propTypes = {
  fetchBlocks: PropTypes.func.isRequired,
  fetchBeds: PropTypes.func.isRequired,
  // createNewScout: PropTypes.func.isRequired,
  blocks: PropTypes.array.isRequired,
  beds: PropTypes.array.isRequired,
  personnel: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  blocks: state.blocks.blocks,
  beds: state.beds.beds,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  fetchBlocks,
  fetchBeds,
  // createNewScout,
})(Blocks);
