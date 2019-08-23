import React from 'react';
import Loading from './Loading';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weather';



const API_KEY = '843e233f47326fde038c1d3ea30e0179';

export default class App extends React.Component {
  state = {
    isLoading: true
  }

  getWeather = async(lat, lon) => {
    const {
      data: {
        main: { temp },
        weather
      } 
    } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`);
    
    this.setState({
      isLoading: false,
      temp,
      condition: weather[0].main
    })
  }

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
      // Send to API and get the weather
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you","So Sad");
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  render(){
    const { isLoading, temp, condition } = this.state;
    return (
      isLoading 
      ? <Loading />
      : <Weather temp= {Math.round(temp)} condition= {condition} />
    )
  }
}

