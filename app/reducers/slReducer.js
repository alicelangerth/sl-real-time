export default function reducer(state={
  metros: [],
  fetching: false,
  fetched: false,
  error: null,
  isLoaded: false,
  timeLeft: 0
}, action) {

  switch (action.type) {
    case "FETCH_SL": {
      return {
        ...state, 
        fetching: true,
        fetched: false
      }
    }
    case "FETCH_SL_REJECTED": {
      return {
        ...state, fetching: false, error: true
      }
    }
    case "FETCH_SL_FULLFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        metros: action.payload,
        isLoaded: true
      }
    }
    case "SYNC_CYCLE": {
      return {
        ...state,
        timeLeft: action.timeLeft  
      }
    }
  }
  return state;
}