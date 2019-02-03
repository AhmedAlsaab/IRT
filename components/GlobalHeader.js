import React, { Component } from 'react'
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Container, Header, Body, Title, Right, Left } from 'native-base';

export default class GlobalHeader extends Component {
  render() {
    return (
      
        <Header style={styles.container}>
          <Left style={styles.flex_1} />
          <Body style={styles.flex_1}>
            <Title>TFW</Title>
          </Body>
          <Right style={styles.flex_1} />
        </Header>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#ff3333'
      }
    }),
  },
  flex_1: {
    flex: 1,
    alignItems: 'center'
  }
});