import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Linking, Text, FlatList } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import GlobalHeader from './components/GlobalHeader';
import AppNavigator from './navigation/AppNavigator';
import RegistrationScreen from './screens/RegistrationScreen';
import JourneyScreen from './screens/JourneyScreen';
import { Permissions } from 'expo';

export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isLoadingComplete: false,
    data:[]
  };

  // Asks the user for permission to turn on location 
  permissionFlow = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    this.setState({ status });

    if (status !== 'granted') {
      Linking.openURL('app-settings');
      return;
    }
  }

  fetchData= async() =>{
    const response = await fetch('http://192.168.0.33:3000/users');
    const users = await response.json();
    this.setState({data: users});
  }

  componentDidMount(){
    this.fetchData();
  }
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
    
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <GlobalHeader />
            <Text onPress={this.permissionFlow}>
              Click on me! Location Permissions: {this.state.status}
            </Text>

            <FlatList 
              data={this.state.data}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item}) =>
              <View style={{backgroundColor:'#abc123', padding:10, margin: 10}}>
                <Text>{item.forename}</Text>
                <Text>{item.surname}</Text>
                <Text>{item.student_no}</Text>
              </View>
            }
            />
            <AppNavigator />
            </View>
        );
      
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
