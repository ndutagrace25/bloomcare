import AsyncStorage from '@react-native-community/async-storage';

import {
    axios,
    createError
} from '../utils';
import {
    GET_ERRORS,
    FETCH_DATA
}
from "./types";

export const fetchAppData = () => dispatch => {
    const endpoints = [{
            name: "@blocks",
            link: "block/all"
        }, {
            name: "@beds",
            link: "bed/all"
        }, {
            name: "@plants",
            link: "plant/all"
        }, {
            name: "@varieties",
            link: "variety/all"
        }, {
            name: "@issueTypes",
            link: "issue-type/all"
        }, {
            name: "@issues",
            link: "issue/all"
        }, {
            name: "@issueCategories",
            link: "issue-category/all"
        }, {
            name: "@points",
            link: "point"
        }, {
            name: "@score",
            link: "score"
        }, {
            name: "@entries",
            link: "entry/all"
        },
        {
            name: "@scout",
            link: "scout/personnel"
        },
        {
            name: "@personnel",
            link: "personnel/all"
        }
    ];
    // console.log(endpoints);
    let promises = [];

    const storeData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
        } catch (err) {
            // dispatch(createError(err, GET_ERRORS));
        }
    }

    for (let r = 0; r < endpoints.length; r++) {
        let currentEndpointLink = endpoints[r].link;
        let currentEndpointName = endpoints[r].name;

        promises.push(
            axios
            .get(currentEndpointLink)
            .then(res => {
                // console.log(currentEndpointLink);
                // Add access token to local storage
                storeData(currentEndpointName, JSON.stringify(res.data));
                // console.log(JSON.stringify(res.data));
            })
            .catch(err => {
                console.log(err);
                dispatch(createError(err, GET_ERRORS));
            })
        );
    }

    Promise.all(promises)
        .then(() => {
            const storeFetchedStatus = async (status) => {
                try {
                    await AsyncStorage.setItem('@appDataFetched', status);

                    dispatch({
                        type: FETCH_DATA,
                        payload: true
                    });
                } catch (err) {
                    dispatch(createError(err, GET_ERRORS));
                }
            }

            // Add fetched status to local storage
            storeFetchedStatus('true');
        })
        .catch((err) => {
            console.log(err);
            dispatch(createError(err, GET_ERRORS));
        });
}