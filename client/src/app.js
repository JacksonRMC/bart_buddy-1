import React from 'react';
import ReactDOM from 'react-dom';
import View from './components/view';
import Bulletin from './components/bulletin';
import Station from './components/station';
import TrainRoutes from './components/trainRoutes';
import Map from './components/map.js';
import ClosestStation from './components/closestStation';
import stationLat_and_Long from './components/station_coordinates';
import hardCodedTrainRoutes from './components/hardCodedTrainRoutes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios'


injectTapEventPlugin();


const getCoords = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition((position) => {
    resolve({ lat: position.coords.latitude, long: position.coords.longitude });
  });
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      lat: 0,
      long: 0,
      isLoading: false,
      currentStation: stationLat_and_Long[0],
      trainRoute: hardCodedTrainRoutes[0]
    };
    this.testClick = this.testClick.bind(this);
    this.trainRouteUpdate = this.trainRouteUpdate.bind(this);
    this.stationUpdate = this.stationUpdate.bind(this);
    this.simplePost = this.simplePost.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoading: true
    });

    getCoords()
    .then( (response) => {
      this.setState({
        lat: response.lat,
        long: response.long,
        isLoading: false
      });
    });
  }

  simplePost(newTrainRoute, newStation) {
    axios.post('/api', { 
      trainRoute: newTrainRoute, 
      currentStation: newStation
    }).then(res => {
      console.log(res);
    })
    .catch(err => {
      throw err;
    });
  }

  trainRouteUpdate(data) {
    this.setState({trainRoute: data});
    this.simplePost(data, this.state.currentStation);
  }

  stationUpdate(data) {
    this.setState({currentStation: data});
    this.simplePost(data, this.state.currentStation);
  }

  getSchedule(station) {
    let tempSchedule = [];

    axios.post('/api/schedule', station)
    .then( 
      res => res.data.station.etd.map( 
        route => route.estimate.map( 
          eta => { tempSchedule.push( {minutes: eta.minutes, destination:route.destination} ) } 
        ) 
      )
    )
    .then( () => {
      this.setState({
        schedule: tempSchedule
      })
    }
    );
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Station setStation={this.setStation} getSchedule={this.getSchedule}/>
          <TrainRoutes userinputhandler={this.trainRouteUpdate}/>
          <Bulletin station={this.state.currentStation}/>
          <Map lat={this.state.lat} long={this.state.long}/>
          <View />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

