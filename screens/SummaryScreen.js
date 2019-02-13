import React from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';

export default class SummaryScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        isLoadingComplete: false,
        data: []
    };

    fetchData = async () => {
        const response = await fetch('http://192.168.0.10:3000/journey');
        const journeyData = await response.json();
        this.setState({ data: journeyData });
    }

    componentDidMount() {
        this.fetchData();
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container style={styles.contentContainer}>
                    <Content>
                        <GlobalHeader type={1} />
                        <View>
                            <View>
                                <Text>YOUR JOURNEY</Text>
                                <Text>Times are an approximation and subject to change. You will receive confirmation on the day of travel.</Text>
                            </View>

                            <View>
                                {/* Summary goes here */}
                            </View>
                            <View>
                                {/* Payment stuff here */}
                            </View>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
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
