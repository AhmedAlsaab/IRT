import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SummaryScreen extends React.Component {
    static navigationOptions = {
        header: null,
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
                            {/* Page header and introductory text */}
                            <View style={styles.introduction}>
                                <Text style={styles.header1}>YOUR JOURNEY</Text>
                                <Text style={styles.body}>Times are an approximation and subject to change. You will receive confirmation on the day of travel.</Text>
                            </View>

                            {/* The summary card showing booking information */}
                            <View style={styles.summaryCard}>
                                <View style={styles.cardContent}>
                                    <View style={styles.details}>
                                        <View style={styles.icon}>
                                            <Icon name="date-range" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>{moment().format('MMMM Do YYYY')}</Text>
                                        </View>
                                        {this.state.data.map((coordinate) => {
                                            return (
                                                <View key={coordinate.type} style={styles.icon}>
                                                    <Icon name={coordinate.type === "Start" ? "my-location" : "location-on"} size={20} color="#bcbcbc" />
                                                    <Text style={styles.cardBody}>{coordinate.street}, {coordinate.city}</Text>
                                                </View>)
                                        })}
                                        <View style={styles.icon}>
                                            <Icon name="people" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>2 Passengers</Text>
                                        </View>
                                        <View style={styles.icon}>
                                            <Icon name="accessible" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>1 Wheelchair</Text>
                                        </View>
                                    </View>
                                    <View style={styles.journeyInfo}>
                                        <Text style={styles.cardBody}>£6.00</Text>
                                        <Icon name="directions-bus" size={65} color="#bcbcbc" />
                                        <Text style={styles.cardVehicle}>Minibus</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Payment summary and options */}
                            <View style={styles.paymentInfo}>
                                <Text style={styles.header2}>PAYMENT</Text>
                                <Text style={styles.body}>Following payment you will receive confirmation of payment and booking.</Text>
                                <View style={styles.paymentSummary}>
                                    <Text style={styles.paymentText}>Total</Text>
                                    <Text style={styles.paymentText}>£6.00</Text>
                                </View>

                                {/* Wallet information */}
                                <View style={styles.walletBlance}>
                                    <Text style={styles.balance}>£12.00</Text>
                                    <Text style={styles.body}>Wallet Balance</Text>
                                    <View style={styles.buttonContainer}>
                                        <Button
                                            danger
                                            style={[ styles.button, { backgroundColor: '#ff0000' } ]}
                                        >
                                            <Text style={styles.buttonText}>Pay</Text>
                                        </Button>
                                        <Button
                                            bordered
                                            danger
                                            style={styles.button}
                                            onPress={() => {
                                                this.props.navigation.navigate('Wallet')
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Add Funds</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Content>
                </Container>
            </StyleProvider >
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
    header1: {
        width: '80%',
        fontSize: 28,
        color: 'gray',
        marginBottom: 5,
    },
    header2: {
        fontSize: 16,
        color: '#bcbcbc',
        marginTop: 15,
        marginBottom: 10,
    },
    body: {
        color: '#bcbcbc',
        fontSize: 16,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
        borderTopWidth: 0.5,
        borderTopColor: '#d3d3d3',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d3d3d3',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        width: '80%',
        justifyContent: 'space-between',
    },
    details: {
        width: '70%',
    },
    journeyInfo: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
    },
    cardBody: {
        fontSize: 18,
        color: 'gray',
        marginLeft: 6,
    },
    cardVehicle: {
        fontSize: 13,
        color: 'gray',
        marginLeft: 6,
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    paymentInfo: {
        width: '80%',
        alignSelf: 'center',
    },
    paymentText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
    },
    paymentSummary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 0.5
    },
    walletBlance: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    balance: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginTop: 15,
        justifyContent: 'space-evenly',
        marginBottom: 15,
    },
    button: {
        width: '45%',
        justifyContent: 'center',
    },
});
