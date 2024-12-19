export const setInputValue = (field, value) => ({
    type: 'SET_INPUT_VALUE',
    payload: { field, value },
});

export const setError = (field,value)=>({
    type:'SET_ERROR',
    payload:{field,value}
})