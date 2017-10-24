import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { fetchSl} from "./actions/slActions";
import Departure from "./components/Departure"
import './App.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderClass: '',
      loaderStyle: { animationDuration: '' }
    }
  }

  fetchSl() {
    this.props.dispatch(fetchSl());
  }

  componentDidMount() {
    this.fetchSl();
    setInterval( this.fetchSl.bind(this), (2 * 1000) );
  }

  componentWillReceiveProps(nextProps) {

    console.log( this.props.timeLeft )
    
    if ( nextProps.timeLeft <= 1 ){
      this.setState({ loaderClass: 'next-request complete'})
      
    } else {
      this.setState({ loaderClass: 'next-request run' })
      this.setState({ loaderStyle: { animationDuration: `${nextProps.timeLeft}s` } })
      
    }
  }

  render() {
    //Error
    if( this.props.error === true ) {
      
      return(
        <div className="App error">
          <p>Det går för tillfället inte att ansluta till SL:s servrar</p>
          <span role="img" aria-label="sad-face" className="sad-face">&#128575;</span>
        </div>
      )
      
    }

    //Fetch not finished 
    if( this.props.isLoaded === false ) {

      return null
      
    } 
    
    //Fetch finished
    let northDepartrues;
    let southDepartrues;
    if( this.props.isLoaded === true ) {
      
      northDepartrues= this.props.northBound.map(( item, index ) => {
        return <Departure key={ index } metro={ item }/>
      })
            
      southDepartrues= this.props.southBound.map(( item, index ) => {
        return <Departure key={ index } metro={ item }/>
      })

      
    }
    
    let loaderStyle = this.state.loaderStyle;
    console.log(loaderStyle)
    return (
      <div className="App">
        <div className={ this.state.loaderClass } style={ loaderStyle }></div>
        <p className="latest">senaste update <span>&#10095;</span></p>
        <p className="next"><span>&#10094;</span> nästa update</p>
        <h1>Avgångar från Gamla stan</h1>
        <section className="departures">
          <div className="north">
            <h2>Norrut <span>&uarr;</span></h2>
            { northDepartrues }
          </div>
          <div className="south">
            <h2>Söderut <span>&darr;</span></h2>
            { southDepartrues }
          </div>
        </section>
      </div>
    );
      
  }
}


const mapStateToProps = ({ fetched, metros, error, fetching, isLoaded, timeLeft }) => {
  
  let departures = metros.slice();

  //Sort departure DESC by direction
  const getDirectionSorted = (departures, direction) => {

    //Filter by direction
    let deps = departures.slice()
    deps = deps.filter( dep => {
      return dep.JourneyDirection === direction
    })

    //Filter by format "Nu"
    let nowDeps = deps.filter( dep => {
      return dep.DisplayTime.includes('Nu')
    })
  
    //Filter by format "XX min". Sort in descending order.
    let soonDeps = deps.filter( dep => {
      return dep.DisplayTime.includes(' min')
    }).sort( (a, b) => {
      let numA = parseInt(a.DisplayTime.substring(0, a.DisplayTime.length - 4))
      let numB = parseInt(b.DisplayTime.substring(0, b.DisplayTime.length - 4))
      return numA - numB
    })
  
    //Filter by format XX:XX. Sort in descending order.
    let laterDeps = deps.filter( dep => {
      return dep.DisplayTime.match(/\d{1,2}:\d\d/)
    }).sort( (a, b) => {
      let regexp = /(\d{1,2}):(\d\d)/
      let matchA = a.DisplayTime.match(regexp)
      let dateA = new Date(a.ExpectedDateTime)
      let dateB = new Date(b.ExpectedDateTime)
      return dateA.getTime() - dateB.getTime()
    })
  
    let concatedDeps = nowDeps
    concatedDeps.push(...soonDeps, ...laterDeps)
    return concatedDeps
  }

  let northBound = getDirectionSorted(departures, 1)
  let southBound = getDirectionSorted(departures, 2)
  
  let props = { fetched, metros, error, fetching, isLoaded, northBound, southBound, timeLeft };
  return props;
}

export default connect(mapStateToProps)(App);
