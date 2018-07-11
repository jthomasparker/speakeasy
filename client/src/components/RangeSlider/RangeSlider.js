import Slider from 'react-rangeslider'
import React, {Component} from "react";
 

  const RangeSlider = props => (
    <div>
      <Slider
        value={props.value}
        orientation={props.orientation}
        onChange={props.handleSliderChange}
       labels={props.labels}
      />
    </div>
    )
  


export default RangeSlider;