import React from 'react';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, ScaleControl, ZoomControl  } from "react-mapbox-gl";
import ReactDOM from 'react-dom';
import PubNub from 'pubnub';
import eon from 'eon-map';
import mapbox from 'mapbox.js';
import mapboxgl from 'mapbox-gl';
import mapAttributes from './map/map_components.js';
import northStations from './northStations.js'; 



const pubnub = new PubNub({
    subscribeKey: mapAttributes.subscribeKey,
    publishKey: mapAttributes.publishKey,
    secretKey: mapAttributes.secretKey,
    ssl: true
});
const channel = 'bart_buddy';


var theLayer = ReactMapboxGl.Layer;
var theFeature = ReactMapboxGl.Feature;
var theGeo = ReactMapboxGl.GeoJSONLayer;

class MapTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      popup: null,
      center: [-122.238, 37.80]
    };
  }

    handleClick () {
    let i = -1;
   
      setInterval((arg) => {
        i++;
        this.setState({
          center: [northStations[i][0], northStations[i][1]]
        })
        new PubNub({
          publishKey: mapAttributes.publishKey, // replace with your own pub-key
          subscribeKey: mapAttributes.subscribeKey // replace with your own sub-key
        }).publish({
        channel: ['eon-map'],
        message:[
          {"latlng":[ northStations[i][1], northStations[i][0] ]} 
        ]
        });
      }, 5000)
    
  }

   //   setInterval((arg) => {
   //     new PubNub({
   //       publishKey: mapAttributes.publishKey, // replace with your own pub-key
   //       subscribeKey: mapAttributes.subscribeKey // replace with your own sub-key
   //     }).publish({
   //      channel: 'eon-map',
   //      message: [
   //      ,
   //      {"latlng":[ 33 * Math.random(), -89 * Math.random()]},
   //      {"latlng":[ 33 * Math.random(), -89 * Math.random()]},
   //      {"latlng":[ 33 * Math.random(), -89 * Math.random()]},
   //      {"latlng":[ 33 * Math.random(), -89 * Math.random()]},
   //      {"latlng":[ 33 * Math.random(), -89 * Math.random()]},
   //      ]
   // });
   // }, 1000)


    componentDidMount() {
    console.log(JSON.stringify(eon))
     let map = eon.map({
       pubnub: new PubNub({
        publishKey: mapAttributes.publishKey, // replace with your own pub-key
        subscribeKey: mapAttributes.subscribeKey, // replace with your own sub-key
        ssl: true
      }),
       id: 'map',
       mbToken: 'pk.eyJ1IjoiamF4b25jYXJ0ZXIiLCJhIjoiY2ozYXkyeTMwMDExbTJ5cGh0N3I5M2djNiJ9.BiO4svi_FBp5s49sLjiglg',
       mbId: 'jaxoncarter.cj3g8edgk000d33mh10iqxryr-4ndup',
       channels: ['eon-map'],
       rotate: true,
       message: function (data) {
         console.log(data[0].latlng)
         map.setView(data[0].latlng);
      }
     })
  }

  render () {
    return (
      <div>
      <button onClick={this.handleClick.bind(this)}> Dance, Petunia </button>
      <div id='map'>
      <ReactMapboxGl
        style="mapbox://styles/jaxoncarter/cj3gdu8u5000u2sqzx5jpufk7"
        accessToken="pk.eyJ1IjoiamF4b25jYXJ0ZXIiLCJhIjoiY2ozYXkyeTMwMDExbTJ5cGh0N3I5M2djNiJ9.BiO4svi_FBp5s49sLjiglg"
        containerStyle={{
          height: "500px",
          width: "100%"
        }}
        center={this.state.center}
        zoom={[10]}> 



      </ReactMapboxGl>
      <h1>Bottom</h1>
      </div>
      </div>

    );
  }
}

export default MapTest;