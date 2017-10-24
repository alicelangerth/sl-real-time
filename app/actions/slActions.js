export function fetchSl() {

  return function(dispatch) {
      
    dispatch({type: "FETCH_SL"});
    
    fetch(`http://localhost:5000/external-api`)
    .then(response => response.json())
    .then( response => {
      dispatch({type: "FETCH_SL_FULLFILLED", payload: response.response.ResponseData.Metros})
      dispatch({type: "SYNC_CYCLE", cycleLength: response.cycleLength, timeLeft: response.timeLeft})
    })
      .catch((err) => {
        console.log(err)
        dispatch({type: "FETCH_SL_REJECTED"})
      })
  }
}
