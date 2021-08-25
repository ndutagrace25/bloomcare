import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from "@react-native-community/netinfo";
import {
    axios,
    setAuthToken,
    createError,
    isOnline,
    showError
} from '../utils';
import {
    SET_CURRENT_PERSONNEL,
    PERSONNEL_ERRORS,
    SET_PASSWORD_RESET
}
from "./types";

export const loginPersonnel = (personnel) => dispatch => {

    NetInfo.fetch().then(state => {
        if (state.isConnected && state.isInternetReachable) {
            axios
                .post("personnel/login", personnel)
                .then(res => {
                    
                    const {
                        accessToken
                    } = res.data;

                    //set token to auth header
                    setAuthToken(accessToken);

                    getData = async key => {
                        let user;
                        let valueObject;
                        personnel['token'] = accessToken;

                        try {
                            const value = await AsyncStorage.getItem(key);
                            if (value !== null) {
                                valueObject = JSON.parse(value);

                                const userExists = valueObject.filter((item) => {
                                    return (item.phone === personnel.phone && item.password === personnel.password)
                                });

                                if(userExists.length === 0){
                                    user = personnel;
                                }
                            } else {
                                valueObject = [];
                                user = personnel;
                            }

                            if(user){
                                valueObject.push(user);

                                await AsyncStorage.setItem('@user', JSON.stringify(valueObject));
                                await AsyncStorage.setItem('@jwtToken', JSON.stringify(personnel));

                                //decode allUsers to get user data
                                const decoded = jwt_decode(accessToken);
                                decoded['personnel'] = personnel;
                                //set current user
                                dispatch(setCurrentUser(decoded));
                            }
                        } catch (e) {
                            dispatch({
                                type: PERSONNEL_ERRORS,
                                payload: {error: e.message}
                            });
                        }
                    };
                    
                    getData('@user');
                })
                .catch(err => {
                    dispatch(createError(err, PERSONNEL_ERRORS));
                });
        } else {
            dispatch({
                type: PERSONNEL_ERRORS,
                payload: {error: 'You are offline. Please turn on Wi-Fi or data to continue'}
            });
        }
    });
}

export const resetPersonnelPassword = (personnel) => dispatch => {
    axios
        .patch("personnel/reset_password", personnel)
        .then(res => {
            dispatch({
                type: SET_PASSWORD_RESET,
                payload: res.data.message
            });
        })
        .catch(err => {
            dispatch(createError(err, PERSONNEL_ERRORS));
        })
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_PERSONNEL,
        payload: decoded
    }
}