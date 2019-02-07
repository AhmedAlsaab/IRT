import React, { Component } from 'react'
import { Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Container, Header, Body, Title, Right, Left } from 'native-base';

export default class GlobalHeader extends Component {
  render() {
    return (

      <Header style={styles.container}>
        <Left style={styles.flex_1} />
        <Body style={styles.flex_1}>
          <Image
            source={require('../branding/logos/two_line_version/TFW_two_line_mono_negative_rgb.png')}
            style={{height: 50, width: 220}}
          />
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
        backgroundColor: '#ff0000',
        height: 65,
      }
    }),
  },
  flex_1: {
    flex: 1,
    alignItems: 'center'
  }
});