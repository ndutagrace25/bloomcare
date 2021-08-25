import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import PropTypes from 'prop-types';
import { CheckBox } from 'react-native-elements';

const IssueBeneficial = ({
  realmIssueTypes,
  realmIssues,
  checked,
  scoreValue,
  setIssue,
  setIssueValueWithoutCategory,
  radio_props,
}) => {
  const beneficials = realmIssueTypes.filter(issueT => {
    return issueT.issue_type_name === 'Beneficials';
  });

  const beneficialName = beneficials[0].issue_type_name;
  const beneficialId = beneficials[0].id;

  const beneficialIssues = realmIssues.filter(issue => {
    return issue.issue_type_id === beneficialId;
  });

  const allIssues = beneficialIssues.map(issue => (
    <View style={styles.rowContainer} key={issue.id}>
      <View style={styles.rowTop}>
        <CheckBox
          title={issue.issue_name}
          containerStyle={styles.chkBoxContainer}
          textStyle={styles.chkBoxTitle}
          size={20}
          checked={checked[issue.id] ? true : false}
          onPress={() => setIssue(beneficialId, issue.id)}
        />
      </View>
      <View>
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
                isSelected={scoreValue[issue.id] === cat.value ? true : false}
                onPress={value =>
                  setIssueValueWithoutCategory(beneficialId, value, issue.id)
                }
                borderWidth={1}
                buttonInnerColor={'#2196f3'}
                buttonOuterColor={
                  scoreValue[issue.id] === cat.value ? '#2196f3' : '#2196f3'
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
  ));

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.title}>
        <Text style={styles.titleText}>{beneficialName}</Text>
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
  chkBoxContainer: {
    backgroundColor: 'transparent',
    marginLeft: 0,
  },
  chkBoxTitle: {
    color: '#9C27B0',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },

  radioStyle: {
    width: '50%',
    justifyContent: 'space-between',
  },
  txtCategory: {
    color: '#000',
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(10),
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
  card: {
    backgroundColor: '#ffffff',
    color: '#32485f',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 4,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#9e9e9e',
    height: 30,
  },
  cardRowTitle: {
    width: 90,
  },
  blueText: {
    fontSize: 15,
    color: '#2196F3',
  },
  purpleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  greyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9e9e9e',
  },
  cardBody: {
    color: '#32485f',
    padding: 14,
    paddingTop: 5,
  },
  cardRow3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  rowItem3: {
    flexDirection: 'row',
  },
  rowItem: {
    flexDirection: 'row',
    width: '46%',
  },
  trashContainer: {
    marginLeft: 'auto',
    position: 'relative',
    top: -15,
  },
  rowBtm3: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(2),
  },
  rowTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: responsiveWidth(1),
  },
});

IssueBeneficial.propTypes = {
  issueTypes: PropTypes.array.isRequired,
  issues: PropTypes.array.isRequired,
  setIssue: PropTypes.func.isRequired,
  setIssueValueWithoutCategory: PropTypes.func.isRequired,
  checked: PropTypes.object.isRequired,
  scoreValue: PropTypes.object.isRequired,
  radio_props: PropTypes.array.isRequired,
};

export default IssueBeneficial;
