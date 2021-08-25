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
    FETCH_POINTS
}
from "./types";

import {
    createPoint
} from '../models/Blocks';

// export const getPoints = (scout) => dispatch => {
//     getData = async (key) => {
//         try {
//             const value = await AsyncStorage.getItem(key);

//             if (value === null || value === false) {
//                 dispatch(createError({
//                     error: "Points not found"
//                 }, GET_ERRORS));
//             } else {
//                 dispatch({
//                     type: FETCH_POINTS,
//                     payload: JSON.parse(value)
//                 });
//             }
//         } catch (e) {
//             dispatch(createError(e, GET_ERRORS));
//         }
//     }

//     getData("@points");
// }

export const addScoutPoint = (point, blockId, bedId, stationId, user) => dispatch => {

    const pointId = point._id;

    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value === null || value === false) {
                dispatch(createError({
                    error: "Please select a station and try again"
                }, GET_ERRORS));
            } else {
                const newScout = JSON.parse(value);
                let pointFound = false;

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
                                            const station = stations[t];

                                            if (station._id === stationId) {

                                                const points = station.points;

                                                for (let u = 0; u < points.length; u++) {

                                                    if (points[u]._id === point._id) {
                                                        pointFound = true;
                                                        break;
                                                    }
                                                }

                                                if (!pointFound) {
                                                    newScout[q].blocks[r].beds[s].stations[t].points.push(point);
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
                        break;
                    }
                }

                storeNewScout(newScout, blockId, bedId, stationId, pointId, user);
            }
        } catch (e) {
            console.log(e);
            dispatch(createError(e, GET_ERRORS));
        }
    }

    const storeNewScout = async (newScout, block, bed, station, point, personnel) => {
        try {
            await AsyncStorage.setItem('@newScout', JSON.stringify(newScout));
            // Actions.issues({
            //     personnel: personnel,
            //     currentBlock: block,
            //     currentBed: bed,
            //     currentStation: station,
            //     currentPoint: point
            // });
        } catch (err) {
            dispatch(createError(err, GET_ERRORS));
        }
    }

    getData("@newScout");
}

export const getPoints = () => dispatch => {
    axios
        .get(`point/all`)
        .then(res => {
            dispatch({
                type: FETCH_POINTS,
                payload: res.data,
            });

            createPoint(res.data)
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