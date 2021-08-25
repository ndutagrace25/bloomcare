import AsyncStorage from '@react-native-community/async-storage';
import {
    Actions
} from 'react-native-router-flux';

import {
    axios,
    createError
} from '../utils';
import {
    GET_ERRORS,
    FETCH_STATIONS
}
from "./types";

import {
    createStation,
} from '../models/Blocks';

// export const getStations = (scout) => dispatch => {
//     getData = async (key) => {
//         try {
//             const value = await AsyncStorage.getItem(key);

//             if (value === null || value === false) {
//                 dispatch(createError({
//                     error: "Stations not found"
//                 }, GET_ERRORS));
//             } else {
//                 dispatch({
//                     type: FETCH_STATIONS,
//                     payload: JSON.parse(value)
//                 });
//             }
//         } catch (e) {
//             dispatch(createError(e, GET_ERRORS));
//         }
//     }

//     getData("@entries");
// }

export const addScoutStation = (station, blockId, bedId, user) => dispatch => {
    const stationId = station._id;

    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value === null || value === false) {
                dispatch(createError({
                    error: "Please select a block and try again"
                }, GET_ERRORS));
            } else {
                const newScout = JSON.parse(value);
                let stationFound = false;

                for (let q = 0; q < newScout.length; q++) {

                    const personnel = newScout[q];

                    if (personnel.phone === user.phone) {

                        for (let r = 0; r < personnel.blocks.length; r++) {
                            const block = personnel.blocks[r];

                            if (block._id === blockId) {

                                for (let s = 0; s < block.beds.length; s++) {
                                    const beds = block.beds[s];

                                    if (beds._id === bedId) {

                                        const stations = beds.stations;

                                        for (let t = 0; t < stations.length; t++) {

                                            if (stations[t]._id === station._id) {
                                                stationFound = true;
                                                break;
                                            }
                                        }

                                        if (!stationFound) {
                                            newScout[q].blocks[r].beds[s].stations.push(station);
                                            break;
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }

                storeNewScout(newScout, blockId, bedId, stationId, user);
            }
        } catch (e) {
            console.log(e);
            dispatch(createError(e, GET_ERRORS));
        }
    }

    const storeNewScout = async (newScout, block, bed, station, personnel) => {
        try {
            await AsyncStorage.setItem('@newScout', JSON.stringify(newScout));
            // Actions.points({
            //     personnel: personnel,
            //     currentBlock: block,
            //     currentBed: bed,
            //     currentStation: station
            // });
        } catch (err) {
            dispatch(createError(err, GET_ERRORS));
        }
    }

    getData("@newScout");
}

export const getStations = () => dispatch => {
    axios
        .get(`station/all`)
        .then(res => {
            dispatch({
                type: FETCH_STATIONS,
                payload: res.data,
            });

            createStation(res.data)
                .then()
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(err => {
            console.log(err);
            dispatch(createError(err, GET_ERRORS));
        });
};