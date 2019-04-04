import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Container, Button, Text, StyleProvider, Item, Row } from 'native-base';
import getTheme from '../../native-base-theme/components';
import platform from '../../native-base-theme/variables/platform';
import GlobalHeader from '../../components/GlobalHeader';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ip from '../../server/keys/ipstore'

import { connect } from 'react-redux';
import { postRequestAuthorized } from '../../API'

class PaymentConfirmationScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    navigateTo = () => {
        this.props.navigation.navigate('Wallet');
    };

    componentDidMount(){
        const data = {
            email: this.props.user.email,
            amount: this.props.navigation.state.params.amount
        }

        postRequestAuthorized(`http://${ip}:3000/booking/payment`, data)
    }

    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <Content>
                        <GlobalHeader
                            type={3}
                            header="Payment Confirmation"
                            navigateTo={this.navigateTo}
                            isBackButtonActive={1}
                        />
                        <View>
                            {/* Page header and introductory text */}
                            <View style={styles.introduction}>
                                <Icon name="wallet" color={colors.bodyTextColor} size={75} style={styles.icon} />
                                <Text style={[styles.body, { marginBottom: 15}]}>
                                    You have added  <Text style={styles.bold}>{`£${parseFloat(this.props.navigation.state.params.amount).toFixed(2)}`} </Text> to your account, you can view your balance in your wallet and see the transaction you have completed
                                </Text>
                                <Text style={styles.body}>
                                    You will shortly receive an e-mail confirmation with details of this transaction.
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

const mapStateToProps = (state) => ({
	user: state.userReducer.user
});

export default connect(mapStateToProps)(PaymentConfirmationScreen);
