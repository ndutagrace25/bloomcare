import React, { PureComponent } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';

import styles from '../common/styles';

class ScoutList extends PureComponent {
    state = { loadComponent: false, page: "" };

    static getDerivedStateFromProps(props, state) {
        if (props.loadComponent !== state.loadComponent) {

            if (props.loadComponent === false) {
                switch (props.page) {
                    case "back":
                        Actions.pop();
                        break;

                    case "scoutList":
                        Actions.scoutList();
                        break;

                    default:
                        break;
                }
            }
            Actions.scoutList();
            return {
                loadComponent: props.loadComponent,
            };
        }

        return null;
    }

    loadPage = () => {
        <View style={[blueBackground]}>
            <Image
                source={require('../../images/bloomcare-logo-white.png')}
            />
            <View style={container}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={heading}>Loading</Text>
            </View>
        </View>
        Actions.resetPassword();
    }

    render() {
        const { blueBackground, heading, container } = styles;
        const { loadComponent } = this.state;

        return (
        );
    }
}

ScoutList.propTypes = {
    page: PropTypes.string,
    loadComponent: PropTypes.bool.isRequired
}

export default ScoutList;