import React from 'react';
import { StyleSheet, View, TouchableHighlight, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Content, Container, Button, Text, Item, Input, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import moment from 'moment';

export default class SummaryScreen extends React.Component {
    static navigationOptions = {
        header: null,
        headerLeft: <Button
            title="Back"
            onPress={() => navigation.goBack()}
        />
    };
    state = {
        isLoadingComplete: false,
        data: [],
        date: new Date(),
        dateOptions: { weekday: "long", year: "numeric", month: "short", day: "numeric" },
    };

    fetchData = async () => {
        const response = await fetch('http://192.168.0.10:3000/journey');
        const journeyData = await response.json();
        this.setState({ data: journeyData });
        console.log(JSON.stringify(data));
    }

    componentDidMount() {
        this.fetchData();
    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                        <GlobalHeader type={1} />
                        <View>
                            <View style={styles.introduction}>
                                <Text style={styles.header}>YOUR JOURNEY</Text>
                                <Text style={styles.body}>Times are an approximation and subject to change. You will receive confirmation on the day of travel.</Text>
                            </View>

                            <View style={styles.summaryCard}>
                                <Text>{moment().format('MMMM Do YYYY')}</Text>
                                {this.state.data.map((coordinate) => {
                                    return (<Text>{coordinate.street}, {coordinate.city}</Text>)
                                })}
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
    introduction: {
        marginTop: 15,
        width: '80%',
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center'
    },
    header: {
        width: '80%',
        fontSize: 28,
        color: 'gray',
        marginBottom: 5,
    },
    body: {
        color: '#bcbcbc',
        fontSize: 16,
    },
    summaryCard: {
        marginTop: 15,
        width: '100%',
        borderTopWidth: 0.5,
        borderTopColor: '#d3d3d3',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d3d3d3',
    },
});
