import axios from 'axios';
import {
    FETCH_ALBUMS,
    GET_ERRORS
} from "./types";

export const fetchAlbums = () => dispatch => {
    axios
        .get("https://shopmate-backend.azurewebsites.net/products")
        .then(albums => {
            console.log(albums.data);
            dispatch({
                type: FETCH_ALBUMS,
                payload: albums.data
            })

        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}