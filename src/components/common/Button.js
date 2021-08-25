import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    Easing,
    Image,
    Alert,
    View,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import spinner from '../../images/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

class Button extends PureComponent {
    constructor() {
        super();
    }

    render() {
        const { isLoading } = this.props;

        const changeWidth = this.props.buttonAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [DEVICE_WIDTH, MARGIN],
        });
        const changeScale = this.props.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, MARGIN],
        });

        return (
            <View style={styles.container}>
                <Animated.View style={{ width: changeWidth }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.onPress(isLoading) }}
                        activeOpacity={1}>
                        {isLoading ? (
                            <Image source={spinner} style={styles.image} />
                        ) : (
                                <Text style={styles.text}>{this.props.title}</Text>
                            )}
                    </TouchableOpacity>
                    <Animated.View
                        style={[styles.circle, { transform: [{ scale: changeScale }] }]}
                    />
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    button: {
        backgroundColor: '#9C27B0',
        height: MARGIN,
        borderRadius: 20,
        zIndex: 100,
        marginHorizontal: 20,
    },
    circle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: '#9C27B0',
        borderRadius: 100,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: '#9C27B0',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    image: {
        width: 24,
        height: 24,
    },
});

Button.propTypes = {
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    buttonAnimated: PropTypes.object.isRequired,
    growAnimated: PropTypes.object.isRequired
}

export default Button;