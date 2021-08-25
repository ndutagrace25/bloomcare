import React from 'react';
import PropTypes from 'prop-types';

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

const Radio = ({ radio_props, handleRadioPress }) => {
    return (
        <RadioForm
            radio_props={radio_props}
            initial={0}
            formHorizontal={false}
            labelHorizontal={true}
            buttonColor={'#2196f3'}
            animation={true}
            onPress={(value) => { handleRadioPress(value) }}
        />
    );
}

Radio.propTypes = {
    radio_props: PropTypes.array.isRequired,
    handleRadioPress: PropTypes.func.isRequired
}

export default Radio;