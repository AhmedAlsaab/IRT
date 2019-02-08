import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Keyboard,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import apiKey from "../google_api_key";
import API_KEY from "../google_api_key";
import _ from "lodash";
import { Content, Container, Button, Text, Item, Input, StyleProvider, Row } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';


export default class JourneyScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  // Temporary states --> These should be in app.js
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      latitude: 0,
      longitude: 0,
      locationPredictions: [],

      isCollapsed: true,
      isDatePickerVisible: false,
      isTimePickerVisible: false,

      from: null,
      to: null,
      date: null,
      time: null,
      numPassenger: null,
      numWheelchair: null,
      //StartLocation
      locationPredictions: [],
      placeID: "",
      street:"",
      city:"",
      country:"",
      startType: 1,

      //EndLocation
      endLocationPredictions: [],
      endPlaceID: "",
      endStreet: "",
      endCity: "",
      endCountry: "",
      endType: 2
    };
    this.startPositionDebounced = _.debounce(
      this.startPosition,
      1000
    );
    this.endLocationDebounced = _.debounce(
      this.endLocation,
      1000
    )
  }

  // Sets the state when each input is changed
  handleFromChange = (event) => {
    this.setState({from: event.target.value})
  }

  handleToChange = (event) => {
    this.setState({to: event.target.value})
  }

  handleNumPassengersChange = (event) => {
    this.setState({numPassenger: event.target.value})
  }

  handleNumWheelchairChange = (event) => {
    this.setState({numWheelchair: event.target.value})
  }

  // Functionality to show/hide the date picker and to set the state
  _showDatePicker = () => this.setState({ isDatePickerVisible: true });
  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (newDate) => {
    this.setState({ date: newDate });
    console.log(this.state.date)
    this._hideDatePicker();
  };

  // Functionality to show/hide the time picker and to set the state
  _showTimePicker = () => this.setState({ isTimePickerVisible: true });
  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = (newTime) => {
    this.setState({ time: newTime });
    console.log(this.state.time)
    this._hideTimePicker();
  };

  // Toggles advanced search inputs
  toggleAdvanced = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    })
  }

  // Not working atm
  // componentDidMount() {
  //   //Get current location and set initial region to this
  //   navigator.geolocation.getCurrentPosition(
  //     position => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude
  //       });
  //     },
  //     error => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
  //   );
  // }

// `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`

//  https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&strictbounds&key=YOUR_API_KEY

// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Stop&types=geocode&location=51.481583,-3.179090&radius=3000&key={API_KEY}


// Restricited search to cardiff - Check Coords
// Radius of search is 3000 meters from location coords
// Strictbounds ensures that no suggestions appear that are not within these paramaters


// Get Start Location
  async startPosition(destination) {
    this.setState({ destination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
    const result = await fetch(apiUrl);
    const jsonResult = await result.json();
    this.setState({
      locationPredictions: jsonResult.predictions
    });
    console.log(jsonResult);
  }

  // Get End Location
  async endLocation(endDestination) {
    this.setState({ endDestination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${endDestination}
    &types=geocode&location=51.481583,-3.179090&radius=3000&key=${API_KEY}&strictbounds`;
    const result = await fetch(apiUrl);
    const jsonResult = await result.json();
    this.setState({
      endLocationPredictions: jsonResult.predictions
    });
    console.log(jsonResult);
  }
// Populate the input field with selected prediction
// Start Location Prediction
  pressedPrediction(
    prediction, 
    selectedPredictionID, 
    selectedPredictionStreet,
    selectedPredictionCity,
    selectedPredictionCountry
    ) {
      console.log(prediction.description)
      console.log(prediction.place_id)
    Keyboard.dismiss();
    this.setState({
      locationPredictions: [],
      destination: prediction.description,
      placeID: selectedPredictionID,
      street: selectedPredictionStreet,
      city: selectedPredictionCity,
      country: selectedPredictionCountry
    });
    Keyboard;
  }
// Populate the input field with selected prediction
// End Location Prediction
  pressedEndPrediction(
    prediction, 
    selectedEndPredictionID, 
    selectedEndPredictionStreet,
    selectedEndPredictionCity,
    selectedEndPredictionCountry
    ) {
      console.log(prediction.description)
      console.log(prediction.place_id)
    Keyboard.dismiss();
    this.setState({
      endLocationPredictions: [],
      endDestination: prediction.description,
      endPlaceID: selectedEndPredictionID,
      endStreet: selectedEndPredictionStreet,
      endCity: selectedEndPredictionCity,
      endCountry: selectedEndPredictionCountry
    });
    Keyboard;
  }

  onSubmit = () => {

    const data = {
      "place_id": this.state.placeID,
      "street": this.state.street,
      "city": this.state.city,
      "country": this.state.country,
      "startType": this.state.startType,
      "endPlaceID": this.state.endPlaceID,
      "endStreet": this.state.endStreet,
      "endCity": this.state.endCity,
      "endCountry": this.state.endCountry,
      "endType": this.state.endType
    }

    fetch('http://192.168.0.33:3000/booking/temp',
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log(data)
  } 

  render() {
    // Start Location Predictions - Suggestion List
    const locationPredictions = this.state.locationPredictions.map(
      prediction => (
        <TouchableHighlight         
          onPress={() => this.pressedPrediction(
            prediction,
            prediction.place_id,
            prediction.terms[0].value,
            prediction.terms[1].value,
            prediction.terms[2].value
            )
          }
          key={prediction.id}
        >
          <Text style={styles.locationSuggestion}>
            {prediction.description}
          </Text>
        </TouchableHighlight>
      )
    );
    // End Location Predictions - Suggestion List
    const endLocationPredictions = this.state.endLocationPredictions.map(
      prediction => (
        <TouchableHighlight
          onPress={() => this.pressedEndPrediction(
            prediction,
            prediction.place_id,
            prediction.terms[0].value,
            prediction.terms[1].value,
            prediction.terms[2].value
            )
          }
          key={prediction.id}
          > 
          <Text style={styles.locationSuggestion}>
          {prediction.description}
          </Text>
          </TouchableHighlight>
      )
    );
// Search box 
// Start Location Input Box
// End Location Input Box

    return (
      <StyleProvider style={getTheme(platform)}>
        <ScrollView>
        <GlobalHeader type={1}  />
          <Container style={styles.contentContainer}>
         
            <Content>

              {/* Favourite recent journeys button */}
              <View style={styles.secondaryButtonContainer}>
                <Button bordered danger style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtontext}>
                    Favourite/Recent Journeys
              </Text>
                </Button>
              </View>

           

            
              {/* Starting location field */}
              <Item style={styles.iconWithInput}>
                <Icon name="my-location" size={20} color="#bcbcbc" />
                <Input
                  placeholder="From"
                  placeholderTextColor="#bcbcbc"
                  onChange={this.handleFromChange}
                  onChangeText={destination => {
                  this.setState({ destination });
                  this.startPositionDebounced(destination);
                  }}
                  value={this.state.destination}
                />
              </Item>
              {locationPredictions}

              {/* Destination field */}
              <Item style={styles.iconWithInput}>
                <Icon name="location-on" size={20} color="#bcbcbc" />
                <Input
                  placeholder="To"
                  placeholderTextColor="#bcbcbc"
                  onChange={this.handleToChange}
                  onChangeText={endDestination => {
                  this.setState({ endDestination });
                  this.endLocationDebounced(endDestination);
                  }}
                    value={this.state.endDestination}
                  />
              </Item>
              {endLocationPredictions}

              {/* Date picker */}
              <TouchableOpacity onPress={this._showDatePicker}>
                <View style={styles.dateTimeContainer}>
                  <Icon name="date-range" size={20} color="#bcbcbc" />
                  {this.state.date
                    ? <Text style={[styles.dateTime, { color: '#000' }]}>{this.state.date.toString().slice(4, 15)}</Text>
                    : <Text style={styles.dateTime} >Date</Text>
                  }
                </View>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDatePicker}
                mode='date'
              />

              {/* Time picker */}
              <TouchableOpacity onPress={this._showTimePicker}>
                <View style={styles.dateTimeContainer}>
                  <Icon name="access-time" size={20} color="#bcbcbc" />
                  {this.state.time
                    ? <Text style={[styles.dateTime, { color: '#000' }]}>{this.state.time.toString().slice(16, 21)}</Text>
                    : <Text style={styles.dateTime} >Time</Text>
                  }
                </View>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this._handleTimePicked}
                onCancel={this._hideTimePicker}
                mode='time'
              />

              {/* Advanced search fields, expands and collapses on button click. */}
              <Collapsible collapsed={this.state.isCollapsed}>
                <View>
                  <Item style={styles.iconWithInput}>
                    <Icon name="people" size={20} color="#bcbcbc" />
                    <Input
                      placeholder="Group size"
                      placeholderTextColor="#bcbcbc"
                      onChange={this.handleNumPassengersChange}
                    />
                  </Item>

                  <Item style={styles.iconWithInput}>
                    <Icon name="accessible" size={20} color="#bcbcbc" />
                    <Input
                      placeholder="No. of wheelchairs"
                      placeholderTextColor="#bcbcbc"
                      onChange={this.handleNumWheelchairChange}
                    />
                  </Item>
                </View>
              </Collapsible>

              {/* Advanced search button, toggles advanced fields */}
              <View style={styles.secondaryButtonContainer}>
                <Button bordered danger
                  style={styles.secondaryButton}
                  onPress={this.toggleAdvanced}
                >
                  <Text style={styles.secondaryButtontext}>
                    {this.state.isCollapsed ? 'Advanced Search' : 'Basic Search'}
                  </Text>
                </Button>
              </View>

              {/* Submit search */}
              <View style={styles.buttonContainer}>
                <Button danger style={styles.button} onPress={this.onSubmit}>
                  <Text>Search</Text>
                </Button>
              </View>
            </Content>
          </Container>
        </ScrollView>
      </StyleProvider >
    );
  }
}

const styles = StyleSheet.create({
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d3d3d3',
    height: 50,
  },
  dateTime: {
    marginLeft: 6,
    color: '#bcbcbc',
    fontSize: 17,
  },
  iconWithInput: {
    marginTop: 10,
  },
  locationSuggestion: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5
  },
  flex_1: {
    flex: 1,
    alignItems: 'center'
  },
  contentContainer: {
    width: '80%',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 15,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    color: '#ff6666'
  },
  buttontext: {
    color: '#000000'
  },
  secondaryButtonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  secondaryButton: {
    width: '100%',
    justifyContent: 'center',
  },
  secondaryButtontext: {
    color: '#ff0000',
  },
});
