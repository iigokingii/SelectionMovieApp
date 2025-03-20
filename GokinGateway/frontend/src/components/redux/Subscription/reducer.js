const initialState = {
    subscription:{},
};

const subscriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SUBSCRIPTION':
            return {
                ...state,
                subscription: action.payload
            };
        default:
            return state;
    }
};

export default subscriptionReducer;