import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';

class ConfirmationScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        isLoadingComplete: false,
        data: [],
        date: new Date(),
        dateOptions: { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' },
        total: 0.0
    };

    navigateTo = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        const data = this.props.navigation.state.params;
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                        <GlobalHeader
                            type={3}
                            header="Confirmation"
                            navigateTo={this.navigateTo}
                            isBackButtonActive={1}
                        />
                        <View>
                            {/* Page header and introductory text */}
                            <View style={styles.introduction}>
                                <Text style={styles.header1}>YOUR BOOKING</Text>
                                <Text style={styles.body}>
                                    Thank you for booking your journey with us on <Text style={styles.bold}>{data.date}</Text>
                                </Text>
                                <View style={styles.coordinates}>
                                    <Text style={styles.bold}>
                                        From: {data.data.street}, {data.data.city}
                                    </Text>
                                    <Text style={styles.bold}>
                                        To: {data.data.endStreet}, {data.data.endCity}
                                    </Text>
                                </View>
                                <Text style={styles.body}>
                                    You will shortly receive an e-mail confirmation with the full details of your booking. You will
                                    be notified again on the day of travel with updated travel times.
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        danger
                                        style={styles.button}
                                        onPress={this.navigateTo}
                                    >
                                        <Text>Done</Text>
                                    </Button>
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
        marginBottom: 5
    },
    body: {
        color: '#bcbcbc',
        fontSize: 20
    },
    bold: {
        color: '#bcbcbc',
        fontSize: 20,
        fontWeight: 'bold',
    },
    coordinates: {
        marginTop: 15,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 25,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#ff0000'
    },
});

export default ConfirmationScreen;
