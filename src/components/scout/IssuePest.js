import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import PropTypes from 'prop-types';
import {CheckBox} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

const IssuePest = ({
  realmIssueTypes,
  realmIssues,
  realmIssueCategories,
  checked,
  scoreValue,
  setIssue,
  setIssueCategory,
  setIssueValue,
  setIssueCategoryTest,
  categoriesChecked,
}) => {
  let allIssues;

  if (
    realmIssueTypes.length > 0 &&
    realmIssues.length > 0 &&
    realmIssueCategories.length > 0
  ) {
    const pests = realmIssueTypes.filter(issueT => {
      return issueT.issue_type_name === 'Pests';
    });

    const pestId = pests[0].id;

    const pestIssues = realmIssues.filter(issue => {
      return issue.issue_type_id === pestId;
    });

    allIssues = pestIssues.map(issue => (
      <View style={styles.rowContainer} key={issue.id}>
        <View style={styles.rowTop}>
          <CheckBox
            title={issue.issue_name}
            containerStyle={styles.chkBoxContainer}
            textStyle={styles.chkBoxTitle}
            size={20}
            checked={checked[issue.id] ? true : false}
            onPress={() => setIssue(pestId, issue.id)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Number"
            placeholderTextColor="#2196f3"
            value={scoreValue[issue.id]}
            keyboardType="phone-pad"
            onChangeText={value => setIssueValue(pestId, value, issue.id)}
          />
        </View>
        <View style={styles.rowBtm3}>
          <RadioForm
            formHorizontal={true}
            animation={true}
            style={styles.radioStyle}
            buttonColor={'#2196f3'}>
            {realmIssueCategories
              .filter(category => {
                return category.issue_id === issue.id;
              })
              .map((cat, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={{label: cat.issue_category_name, value: cat.id}}
                    index={i}
                    isSelected={
                      categoriesChecked[issue.id] === cat.id ? true : false
                    }
                    onPress={value =>
                      setIssueCategory(pestId, value, issue.id)
                    }
                    borderWidth={1}
                    buttonInnerColor={'#2196f3'}
                    buttonOuterColor={
                      categoriesChecked[issue.id] === cat.id
                        ? '#2196f3'
                        : '#2196f3'
                    }
                    buttonSize={20}
                    buttonOuterSize={30}
                    buttonStyle={{}}
                    buttonWrapStyle={{marginLeft: 10}}
                  />
                  <RadioButtonLabel
                    obj={{label: cat.issue_category_name, value: cat.id}}
                    index={i}
                    labelHorizontal={true}
                    onPress={value =>
                      setIssueCategory(pestId, value, issue.id)
                    }
                    labelStyle={{fontSize: 10, color: '#2196f3'}}
                    labelWrapStyle={{}}
                  />
                </RadioButton>
              ))}
          </RadioForm>
        </View>
      </View>
    ));
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      enableOnAndroid={true}>
      <View style={styles.scrollContainer}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Pests</Text>
        </View>
        {allIssues && allIssues}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 0,
    paddingTop: responsiveWidth(2),
  },

  title: {
    width: responsiveWidth(100),
    paddingLeft: responsiveWidth(2),
    marginBottom: responsiveWidth(2),
    marginTop: 0,
  },
  titleText: {
    color: '#2196f3',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'left',
  },
  rowContainer: {
    width: responsiveWidth(100),
    marginBottom: responsiveWidth(2),
    paddingLeft: responsiveWidth(2),
    paddingRight: responsiveWidth(2),
  },
  rowTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(0.5),
  },
  chkBoxContainer: {
    backgroundColor: 'transparent',
    marginLeft: 0,
    borderColor: 'transparent',
  },
  chkBoxTitle: {
    color: '#9C27B0',
    fontSize: responsiveFontSize(1.8),
  },
  chkBoxTitleCategory: {
    color: '#2196f3',
    fontSize: responsiveFontSize(1.8),
  },
  rowBtm3: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    width: '30%',
  },
  picker: {
    color: '#2196f3',
    fontSize: responsiveFontSize(1.6),
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    elevation: 4,
    width: '30%',
    paddingLeft: responsiveWidth(2),
    color: '#2196f3',
    fontSize: responsiveFontSize(1.6),
    height: 40,
  },
  radioStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

IssuePest.propTypes = {
  issueTypes: PropTypes.object.isRequired,
  issues: PropTypes.object.isRequired,
  //   issueCategories: PropTypes.object.isRequired,
  setIssue: PropTypes.func.isRequired,
  setIssueCategory: PropTypes.func.isRequired,
  setIssueValue: PropTypes.func.isRequired,
  checked: PropTypes.object.isRequired,
  categoriesChecked: PropTypes.object.isRequired,
  scoreValue: PropTypes.object.isRequired,
};

export default IssuePest;
