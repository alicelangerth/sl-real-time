import React from 'react';
import './Departure.scss'

const Departure = ( metro ) => {

  let lineColor = 'line-number green';
  if( metro.metro.LineNumber === '13' || metro.metro.LineNumber === '14') {
      lineColor = 'line-number red';
  }

  return (
    <div className="departure-wrapper">
      <p className={ lineColor }> { metro.metro.LineNumber }</p>
      <p>{ metro.metro.Destination }</p>
      <p className="time">{ metro.metro.DisplayTime }</p>
    </div>
  );
}
export default Departure;