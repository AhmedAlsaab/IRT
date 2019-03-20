import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Accordion, Button, Container, Content, Input, Item, StyleProvider, Text } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalHeader from '../components/GlobalHeader';
import ip from '../ipstore';

import { connect } from 'react-redux';
import { amendTicket } from '../redux/actions/ticketAction';

class AmendTicket extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        isLoadingComplete: false,
        date: null,
        time: null,
        numWheelchair: null,
        errors: [],
    };

    onSubmit = () => {
        const ticket = this.props.navigation.state.params.ticket;
        //Send data to the server
        const data = {
            ticketId: ticket.id,
            date: this.state.date === null ? moment(ticket.date).format('YYYY-MM-DD HH:mm:ss') : this.state.date,
            time: this.state.time === null ? moment(ticket.time).format('YYYY-MM-DD HH:mm:ss') : this.state.time,
            numWheelchair: this.state.numWheelchair === null ? ticket.numWheelchairs : this.state.numWheelchair,
            numPassenger: ticket.numPassengers,
        };
        fetch(`http://${ip}:3000/amendTicket`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                switch (responseJSON.status) {
                    //Success
                    case 10:
                        this.props.amendTicket(data)
                        this.props.navigation.navigate('Ticket');
                        break;
                    //Input Validation Failed
                    case 0:
                        this.setState({
                            errors: this.parseErrors(responseJSON.errors)
                        });
                        break;
                }
            })
            .catch((error) => console.log(error));
    }

    parseErrors = (errorList) => {
        var errors = {
            title: 'Errors',
            content: ''
        };

        for (var i = 0; i < errorList.length; i++) {
            errors.content += errorList[i].msg + '\n';
        }

        return [errors];
    };

    navigateTo = () => {
        this.props.navigation.navigate('Details')
    }

    handleNumWheelchairChange = (value) => {
        this.setState({ numWheelchair: value });
    };

    // Functionality to show/hide the date picker and to set the state
    _showDatePicker = () => this.setState({ isDatePickerVisible: true });
    _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

    _handleDatePicked = (newDate) => {
        this.setState({ date: moment(newDate).format('YYYY-MM-DD HH:mm:ss') });
        this._hideDatePicker();
    };

    // Functionality to show/hide the time picker and to set the state
    _showTimePicker = () => this.setState({ isTimePickerVisible: true });
    _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

    _handleTimePicked = (newTime) => {
        this.setState({ time: moment(newTime).format('YYYY-MM-DD HH:mm:ss') });
        this._hideTimePicker();
    };

    render() {
        const data = this.props.navigation.state.params.ticket;
        return (
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <GlobalHeader
                        type={1}
                        navigateTo={this.navigateTo}
                        isBackButtonActive={1}
                    />
                    <Content>
                        {this.state.errors &&
                            !!this.state.errors.length && (
                                <Accordion
                                    dataArray={this.state.errors}
                                    icon="add"
                                    expandedIcon="remove"
                                    contentStyle={styles.errorStyle}
                                    expanded={0}
                                />
                            )}
                        {this.state.error && (
                            <Accordion
                                dataArray={this.state.error}
                                icon="add"
                                expandedIcon="remove"
                                contentStyle={styles.errorStyle}
                                expanded={0}
                            />
                        )}

                        {/* Summary of the current ticket */}
                        <View style={styles.summaryCard}>
                            <View style={styles.cardContent}>
                                <View style={styles.details}>
                                    <View>
                                        <Text style={styles.header2}>CURRENT TICKET DETAILS</Text>
                                        <View style={styles.icon}>
                                            <Icon name="date-range" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>
                                                {moment(data.date).format('MMMM Do YYYY')}
                                            </Text>
                                        </View>
                                        <View style={styles.icon}>
                                            <Icon name="access-time" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>
                                                {moment(data.time).format('LT')}
                                            </Text>
                                        </View>
                                        <View style={styles.icon}>
                                            <Icon name="my-location" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>
                                                {data.fromStreet}, {data.fromCity}
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.icon}>
                                            <Icon name="location-on" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>
                                                {data.toStreet}, {data.toCity}
                                            </Text>
                                        </View>
                                        <View style={styles.icon}>
                                            <Icon name="people" size={20} color="#bcbcbc" />
                                            <Text style={styles.cardBody}>
                                                {data.numPassengers}
                                                {data.numPassengers > 1 ? ' Passengers' : ' Passenger'}
                                            </Text>
                                        </View>
                                        {data.numWheelchairs > 0 ?
                                            <View style={styles.icon}>
                                                <Icon name="accessible" size={20} color="#bcbcbc" />
                                                <Text style={styles.cardBody}>
                                                    {data.numWheelchairs}
                                                    {data.numWheelchairs > 1 ? ' Wheelchairs' : ' Wheelchair'}
                                                </Text>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Inputs to amend ticket including date, time and wheelchairs */}
                        <View style={styles.inputs}>
                            <Text style={styles.body}>
                                If you wish to change details relating to the start/end locations or total number
                                of passengers, please cancel this ticket and re-book.
                            </Text>
                            {/* Date picker */}
                            <TouchableOpacity onPress={this._showDatePicker}>
                                <View style={styles.dateTimeContainer}>
                                    <Icon name="date-range" size={20} color="#bcbcbc" />
                                    {this.state.date ? (
                                        <Text style={[styles.dateTime, { color: '#000' }]}>
                                            {moment(this.state.date).format('Do MMM YY')}
                                        </Text>
                                    ) : (
                                            <Text style={styles.dateTime}>Date</Text>
                                        )}
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDatePickerVisible}
                                onConfirm={(value) => this._handleDatePicked(value)}
                                onCancel={this._hideDatePicker}
                                mode="date"
                            />

                            {/* Time picker */}
                            <TouchableOpacity onPress={this._showTimePicker}>
                                <View style={styles.dateTimeContainer}>
                                    <Icon name="access-time" size={20} color="#bcbcbc" />
                                    {this.state.time ? (
                                        <Text style={[styles.dateTime, { color: '#000' }]}>
                                            {moment(this.state.time).format('LT')}
                                        </Text>
                                    ) : (
                                            <Text style={styles.dateTime}>Time</Text>
                                        )}
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isTimePickerVisible}
                                onConfirm={(value) => this._handleTimePicked(value)}
                                onCancel={this._hideTimePicker}
                                mode="time"
                            />
                            <View>
                                <Item style={styles.iconWithInput}>
                                    <Icon name="accessible" size={20} color="#bcbcbc" />
                                    <Input
                                        maxLength={1}
                                        keyboardType="numeric"
                                        placeholder="No. of wheelchairs"
                                        placeholderTextColor="#bcbcbc"
                                        onChangeText={(value) => this.handleNumWheelchairChange(value)}
                                    />
                                </Item>
                            </View>

                            {/* Submit amendments */}
                            <View style={styles.buttonContainer}>
                                <Button
                                    danger
                                    style={styles.button}
                                    onPress={this.onSubmit}
                                >
                                    <Text>Amend</Text>
                                </Button>
                            </View>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    inputs: {
        width: '80%',
        flex: 1,
        alignSelf: 'center',
        marginTop: 10,
    },
    header1: {
        width: '80%',
        fontSize: 28,
        color: 'gray',
        marginBottom: 5
    },
    header2: {
        fontSize: 16,
        color: '#bcbcbc',
        marginTop: 10,
        marginBottom: 10
    },
    body: {
        color: '#bcbcbc',
        fontSize: 16
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d3d3d3'
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        width: '80%',
        justifyContent: 'space-between'
    },
    details: {
        width: '70%'
    },
    journeyInfo: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%'
    },
    cardBody: {
        fontSize: 18,
        color: 'gray',
        marginLeft: 6
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d3d3d3',
        height: 50
    },
    dateTime: {
        marginLeft: 6,
        color: '#bcbcbc',
        fontSize: 17
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#ff0000'
    },
    buttontext: {
        color: '#000000'
    },
});

const mapDispatchToProps = dispatch => {
    return {
        amendTicket: (data) => dispatch(amendTicket(data))
    };
};

export default connect(null, mapDispatchToProps)(AmendTicket);
