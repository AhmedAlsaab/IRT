import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Content, Container, Button, Text, Accordion } from 'native-base';
import GlobalHeader from '../components/GlobalHeader';

export default class WalletScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  onSubmit = () => {
    this.props.navigation.navigate('AddFunds')
  }

  render() {
    return (
      <Container>
        <GlobalHeader type={1} />
        <Content>
          <View style={styles.headerContainer}>
            <Text>ADD FUNDS</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text>Your Balance</Text>
            <Text style={styles.balanceSpacing}>£0.00</Text>
          </View>
          <View>
           
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  balanceContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    shadowOffset: { width: 0, height: -20},  
    shadowColor: 'black',  
    shadowOpacity: 1,  
    elevation: 10,   
    backgroundColor: '#fff',
    marginBottom: 15
  },
  balanceSpacing: {
    margin: 25
  },
  button: {
    width: 175,
    justifyContent: 'center',
    backgroundColor: '#ff0000',
    borderRadius: 5
  }
});
