import React from 'react';
import { ScrollView, StyleSheet, FlatList, View, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isLoadingComplete: false,
    data:[]
  };

  fetchData= async() =>{
    const response = await fetch('http://192.168.0.10:3000/users');
    const users = await response.json();
    this.setState({data: users});
  }

  componentDidMount(){
    this.fetchData();
  }
  render() {
    return (
      <ScrollView style={styles.container}>
      <Text>Below is a list of student names and student numbers, if you cannot see it, 
        it means that the server is not running or not connecting to your database - Check Teams!</Text>
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
