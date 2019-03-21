import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        const booking = this.props.navigation.state.params;
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                        <GlobalHeader
                            type={3}
                            header="Booking Confirmation"
                            navigateTo={this.navigateTo}
                            isBackButtonActive={1}
                        />
                        <View>
                            {/* Page header and introductory text */}
                            <View style={styles.introduction}>
                                <Icon name="calendar-check-o" color={colors.bodyTextColor} size={75} style={styles.icon} />
                                <Text style={styles.body}>
                                    Thank you for booking your journey with us on <Text style={styles.bold}>{booking.date}</Text> at <Text style={styles.bold}>{booking.time}</Text>.
                                </Text>
                                <View style={styles.coordinates}>
                                    <Text><Text style={styles.bold}>From: </Text><Text style={styles.body}>{booking.data.startLocation}</Text></Text>
                                    <Text><Text style={styles.bold}>To: </Text><Text style={styles.body}>{booking.data.endLocation}</Text></Text>
                                </View>
                                <Text style={styles.body}>
                                    You will shortly receive an e-mail confirmation with the full details of your booking.
                                </Text>
                                <Text style={[styles.body, { marginTop: 15 }]}>
                                    Please remember your chosen time is approximate and you will be notified again on the day of
                                    travel with updated travel times.
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
    body: {
        color: colors.bodyTextColor,
    },
    bold: {
        color: colors.emphasisTextColor,
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
        width: '40%',
        justifyContent: 'center',
        backgroundColor: colors.brandColor
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 20,
    }
});

export default ConfirmationScreen;
