const createError = (err, GET_ERRORS) => {
    const message = (err.message) ? err.message : 'Something went wrong. Please try again';

    if (err.response) {
        if (err.response.data) {
            if (err.response.data.error) {
                return {
                    type: GET_ERRORS,
                    payload: err.response.data.error
                }
            } else {
                return {
                    type: GET_ERRORS,
                    payload: {
                        error: message
                    }
                }
            }
        } else {
            return {
                type: GET_ERRORS,
                payload: {
                    error: message
                }
            }
        }
    } else {
        return {
            type: GET_ERRORS,
            payload: {
                error: message
            }
        }
    }
}

export default createError;