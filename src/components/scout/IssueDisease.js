import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { CheckBox } from 'react-native-elements';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import PropTypes from 'prop-types';

const IssueDisease = ({
  realmIssueTypes,
  realmIssues,
  realmIssueCategories,
  checked,
  scoreValue,
  categoriesChecked,
  setIssue,
  setIssueCategoryAndValue,
  radio_props,
}) => {
  const diseases = realmIssueTypes.filter(issueT => {
    return issueT.issue_type_name === 'Diseases';
  });
  const diseaseId = diseases[0].id;

  const diseaseIssues = realmIssues.filter(issue => {
    return issue.issue_type_id === diseaseId;
  });

  const allIssues = diseaseIssues.map(issue => (
    <View style={styles.rowContainer} key={issue.id}>
      <View style={styles.rowTop}>
        <CheckBox
          title={issue.issue_name}
          containerStyle={styles.chkBoxContainer}
          textStyle={styles.chkBoxTitle}
          size={20}
          checked={checked[issue.id] ? true : false}
          onPress={() => setIssue(diseaseId, issue.id)}
        />
      </View>
      {realmIssueCategories
        .filter(category => {
          return category.issue_id === issue.id;
        })
        .map((issueCategory, i) => (
          <View key={issueCategory.id}>
            <View style={styles.fullWidth}>
              <Text>{issueCategory.issue_category_name}</Text>
            </View>
            <View style={styles.rowBtm3}>
              <RadioForm
                formHorizontal={true}
                animation={true}
                style={styles.radioStyle}
                buttonColor={'#2196f3'}>
                {radio_props.map((cat, i) => (
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      obj={cat}
                      index={i}
                      isSelected={
                        scoreValue[issue.id] === cat.value &&
                          categoriesChecked[issue.id] === issueCategory.id
                          ? true
                          : false
                      }
                      onPress={value =>
                        setIssueCategoryAndValue(
                          diseaseId,
                          value,
                          issue.id,
                          issueCategory.id,
                        )
                      }
                      borderWidth={1}
                      buttonInnerColor={'#2196f3'}
                      buttonOuterColor={
                        scoreValue[issue.id] === cat.value &&
                          categoriesChecked[issue.id] === issueCategory.id
                          ? '#2196f3'
                          : '#2196f3'
                      }
                      buttonSize={20}
                      buttonOuterSize={30}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <RadioButtonLabel
                      obj={cat}
                      index={i}
                      labelHorizontal={true}
                      onPress={value => {
                        console.log(value);
                      }}
                      labelStyle={{ fontSize: 10, color: '#2196f3' }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                ))}
              </RadioForm>
            </View>
          </View>
        ))}
    </View>
  ));

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Diseases</Text>
      </View>
      {allIssues}
    </ScrollView>
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
    justifyContent: 'flex-start',
    marginBottom: responsiveWidth(1),
  },
  chkBoxTitle: {
    color: '#9C27B0',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  rowBtm3: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(2),
  },
  radioStyle: {
    width: '94%',
    justifyContent: 'space-between',
  },
  txtCategory: {
    color: '#000',
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(100),
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    marginTop: 40,
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
  fullWidth: {
    width: responsiveWidth(100),
    paddingLeft: responsiveWidth(3),
  },
});

IssueDisease.propTypes = {
  issueTypes: PropTypes.array.isRequired,
  issues: PropTypes.array.isRequired,
  issueCategories: PropTypes.array.isRequired,
  setIssue: PropTypes.func.isRequired,
  setIssueCategoryAndValue: PropTypes.func.isRequired,
  checked: PropTypes.object.isRequired,
  categoriesChecked: PropTypes.object.isRequired,
  scoreValue: PropTypes.object.isRequired,
  radio_props: PropTypes.array.isRequired,
};

export default IssueDisease;
