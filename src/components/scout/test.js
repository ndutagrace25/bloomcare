import React, { Component } from 'react';
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
    KeyboardAvoidingView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { getNewScout } from '../../actions/scoutActions';
import {
    getIssueTypes,
    getIssues,
    getIssueCategories,
    addScoutIssue,
} from '../../actions/issueActions';
import { getBedPlant } from '../../actions/plantActions';

import { InputField, ButtonSubmit, Radio } from '../common';
import { leftArrowImg } from '../../images';

class Issues extends Component {
    constructor() {
        super();

        this.state = {
            issueTypes: [],
            issues: [],
            issueCategories: [],
            issueType: '',
            issue: '',
            issueCategory: '',
            newScout: [],
            plant: {},
            isLoading: false,
            block: '',
            bed: '',
            station: '',
            point: '',
            value: '',
            blockName: '',
            bedName: '',
            stationName: '',
            pointName: '',
            issueTypeName: '',
            personnel: {}
        };

        this.buttonAnimated = new Animated.Value(0);
        this.growAnimated = new Animated.Value(0);
    }

    componentDidMount() {
        const { currentBlock, currentBed, personnel, currentStation, currentPoint } = this.props;

        this.setState({
            block: currentBlock,
            bed: currentBed,
            personnel: personnel,
            station: currentStation,
            point: currentPoint
        });


        this.props.getNewScout();
        this.props.getIssueTypes();
        this.props.getIssues();
        this.props.getIssueCategories();
        this.props.getBedPlant(this.props.currentBed);

        this.searchItem('@blocks', 'name', 'blockName', this.props.currentBlock);
        this.searchItem('@beds', 'bed_name', 'bedName', this.props.currentBed);
        this.searchItem(
            '@entries',
            'name',
            'stationName',
            this.props.currentStation
        );
        this.searchItem(
            '@points',
            'name',
            'pointName',
            this.props.currentPoint,
            'items',
        );
    }

    static getDerivedStateFromProps(props, state) {
        if (props.newScout !== state.newScout) {
            return {
                newScout: props.newScout,
            };
        }

        if (props.issueTypes !== state.issueTypes) {
            return {
                issueTypes: props.issueTypes,
            };
        }

        if (props.issues !== state.issues) {
            return {
                issues: props.issues,
            };
        }

        if (props.issueCategories !== state.issueCategories) {
            return {
                issueCategories: props.issueCategories,
            };
        }

        if (props.plant !== state.plant) {
            return {
                plant: props.plant,
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

                    this.setState({ [stateKey]: search[0][field] });
                }
            } catch (e) {
                console.log(e);
                dispatch(createError(e, GET_ERRORS));
            }
        };

        getData(item);
    };

    handleRadioPress = value => {
        this.setState({ value });
    };

    handleValueChange = value => this.setState({ value });

    handleIssueTypeChange = issueType => {
        this.setState({ issueType });

        this.searchItem('@issueTypes', 'name', 'issueTypeName', issueType);
    };

    submitIssue = () => {
        if (this.state.isLoading) return;

        this.setState({ isLoading: true });

        const {
            block,
            bed,
            station,
            point,
            issueType,
            issue,
            issueCategory,
            value,
            plant,
            personnel
        } = this.state;

        const scout = {
            date: new Date(),
            block: block,
            bed: bed,
            entry: station,
            point: point,
            issueType: issueType,
            issue: issue,
            issueCategory: issueCategory,
            value: value,
            plant: plant._id,
            variety: plant.variety,
            longitude: '0.0223319',
            latitude: '37.0722295',
        };

        this.props.addScoutIssue(point, block, bed, station, scout, personnel);
    };

    _onGrow() {
        Animated.timing(this.growAnimated, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();
    }

    renderHeading = () => {
        const { blockName, bedName, stationName, pointName } = this.state;

        return (
            <Text style={styles.heading}>
                {blockName} > {bedName} > {stationName} > {pointName}
            </Text>
        );
    };

    renderIssueTypes = () => {
        const { issueTypes } = this.state;

        let allIssueTypes;

        if (issueTypes.length > 0) {
            allIssueTypes = issueTypes.map(issueType => (
                <Picker.Item
                    label={issueType.name}
                    value={issueType._id}
                    key={issueType._id}
                />
            ));
        } else {
            allIssueTypes = null;
        }

        return allIssueTypes;
    };

    renderIssues = () => {
        const { issues, issueType } = this.state;

        let allIssues;

        if (issues.length > 0) {
            allIssues = issues
                .filter(issue => issue.issue_type === issueType)
                .map(issue => (
                    <Picker.Item
                        label={issue.issue_name}
                        value={issue._id}
                        key={issue._id}
                    />
                ));
        } else {
            allIssues = null;
        }

        return allIssues;
    };

    renderIssueCategories = () => {
        const { issue, issueCategories } = this.state;

        let allIssueCategories;

        if (issueCategories.length > 0) {
            allIssueCategories = issueCategories
                .filter(issueCategory => issueCategory.issue === issue)
                .map(issueCategory => (
                    <Picker.Item
                        label={issueCategory.name}
                        value={issueCategory._id}
                        key={issueCategory._id}
                    />
                ));
        } else {
            allIssueCategories = null;
        }

        return allIssueCategories;
    };

    renderPresenceSelection = () => {
        const { issueTypeName, value } = this.state;
        let valueSelect;

        if (issueTypeName === 'Pests') {
            valueSelect = (
                <InputField
                    secureTextEntry={false}
                    placeholder="Enter Scoring Value"
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    handleTextChange={this.handleValueChange}
                    value={value}
                />
            );
        } else if (issueTypeName === '') {
            valueSelect = null;
        } else {
            let radio_props = [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }];

            valueSelect = (
                <View style={styles.radioContainer}>
                    <Radio
                        radio_props={radio_props}
                        value={value}
                        handleRadioPress={this.handleRadioPress}
                    />
                </View>
            );
        }

        return valueSelect;
    };

    render() {
        const {
            isLoading,
            issueType,
            issue,
            issueCategory,
            value,
            block,
            bed,
            station,
            personnel
        } = this.state;

        return (
            <View>
                <View style={styles.navHeader}>
                    <TouchableOpacity
                        onPress={() => {
                            Actions.points({
                                currentBlock: block,
                                currentBed: bed,
                                currentStation: station,
                                personnel: personnel
                            });
                        }}
                        style={styles.imageContainer}>
                        <Image source={leftArrowImg} style={styles.imageHeight} />
                    </TouchableOpacity>
                    <Text style={styles.navHeading}>COLLECT ISSUE</Text>
                </View>

                <ScrollView>
                    <KeyboardAvoidingView behavior="position">
                        <View style={styles.header}>{this.renderHeading()}</View>

                        <View style={styles.container}>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={issueType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.handleIssueTypeChange(itemValue);
                                    }}>
                                    <Picker.Item label="----Select Issue Type----" value="" />
                                    {this.renderIssueTypes()}
                                </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={issue}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ issue: itemValue })
                                    }>
                                    <Picker.Item label="----Select Issue----" value="" />
                                    {this.renderIssues()}
                                </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={issueCategory}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ issueCategory: itemValue })
                                    }>
                                    <Picker.Item label="----Select Issue Category----" value="" />
                                    {this.renderIssueCategories()}
                                </Picker>
                            </View>
                            <View>{this.renderPresenceSelection()}</View>
                            <View style={styles.buttonContainer}>
                                <ButtonSubmit
                                    title="SUBMIT"
                                    isLoading={isLoading}
                                    onPress={this.submitIssue}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: 20,
    },
    navHeader: {
        backgroundColor: '#ffffff',
        height: 50,
        elevation: 6,
        marginBottom: 0,
    },
    imageContainer: {
        marginLeft: 20,
        position: 'absolute',
        top: 15,
        zIndex: 10,
    },
    imageHeight: {
        height: 20,
        width: 20,
    },
    navHeading: {
        color: '#9C27B0',
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#9C27B0',
        height: 50,
        marginTop: 0,
        marginBottom: 0,
    },
    heading: {
        color: '#ffffff',
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
    },
    radioContainer: {
        marginLeft: 20,
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
        color: '#2196F3',
    },

    radioInputs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 40,
        marginTop: 40,
    },
});

Issues.propTypes = {
    getIssueTypes: PropTypes.func.isRequired,
    getIssues: PropTypes.func.isRequired,
    getBedPlant: PropTypes.func.isRequired,
    getIssueCategories: PropTypes.func.isRequired,
    getNewScout: PropTypes.func.isRequired,
    addScoutIssue: PropTypes.func.isRequired,
    issueTypes: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
    issueCategories: PropTypes.array.isRequired,
    newScout: PropTypes.array.isRequired,
    currentBlock: PropTypes.string.isRequired,
    currentBed: PropTypes.string.isRequired,
    currentStation: PropTypes.string.isRequired,
    currentPoint: PropTypes.string.isRequired,
    plant: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    issueTypes: state.issues.issueTypes,
    issues: state.issues.issues,
    issueCategories: state.issues.issueCategories,
    newScout: state.scout.newScout,
    plant: state.plants.plant,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    {
        getIssueTypes,
        getIssues,
        getIssueCategories,
        getNewScout,
        addScoutIssue,
        getBedPlant,
    },
)(Issues);
