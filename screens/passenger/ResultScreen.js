import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import ip from '../../server/keys/ipstore'
import key from '../../server/keys/google_api_key'
import moment from 'moment';
import { getRequestAuthorized } from '../../API'

import GlobalHeader from '../../components/GlobalHeader';
import ResultJourney from '../../components/ResultJourney'
import colors from '../../constants/Colors';

class ResultScreen extends Component {

    static navigationOptions = {
        header: null
    };

    state = {
        journey: []
    }

    removeOverTimeLimitJourneys = (id) => {
        this.setState({
            journey: this.state.journey.filter(journey => journey.props.id !== id)
        })
    }

    onJourneyPress = (id) => {
        this.props.navigation.navigate('Summary', { jData: this.props.navigation.state.params, jId: id });
    }

    componentDidMount() {
        const { lat, lng, endCity, endStreet, numPassenger, returnTicket } = this.props.navigation.state.params;

        getRequestAuthorized(`http://${ip}:3000/journeyResults?street=${endStreet}&city=${endCity}`)
            .then(response => {
                if (response.results.length < 1) return;
                for (let i = 0; i < response.results.length; i++) {
                    const id = response.results[i].journey_id;

                    //Filter result list
                    getRequestAuthorized(`http://${ip}:3000/journey?journeyId=${id}`)
                        .then(response => {
                            var start = '', end = '', waypoints = [{ latitude: lat, longitude: lng }]
                            var startDate1 = response.start_time, endDate1 = response.end_time;

                            for (let i = 0; i < response.results.length; i++) {
                                const element = response.results[i];
                                // console.log(response)
                                switch (element.fk_coordinate_type_id) {
                                    //Start
                                    case 1:
                                        start = element.place_id;
                                        break;

                                    //End
                                    case 2:
                                        end = element.place_id;
                                        break;

                                    //Virtual bus Stop
                                    case 3:
                                        waypoints.push({ latitude: element.latitude, longitude: element.longitude })
                                        break
                                }

                            }

                            fetch(`https://maps.googleapis.com/maps/api/directions/json?key=${key}&origin=place_id:${start}&destination=place_id:${end}&waypoints=${this.waypointArrayToString(waypoints)}`)
                                .then(response => response.json())
                                .then(response => {
                                    let newTotalTime = 0
                                    response.routes[0].legs.map(leg => newTotalTime += parseInt(leg.duration.value))
                                    return Promise.resolve(newTotalTime)
                                })
                                .then((newTotalTime) => {
                                    var startDate = moment(startDate1).toISOString();
                                    var endDate = moment(endDate1).toISOString();
                                    var nowDate = moment(new Date()).toISOString();

                                    var duration = moment.duration(moment(endDate).diff(startDate))
                                    var departDuration = moment.duration(moment(endDate).diff(nowDate))

                                    var totalHours = parseInt(duration.asHours());
                                    var totalMinutes = parseInt(duration.asMinutes()) % 60;
                                    var totalTotalMinutes = parseInt(duration.asMinutes());

                                    var departDays = parseInt(departDuration.asDays());
                                    var departHours = parseInt(departDuration.asHours());
                                    var departMinutes = parseInt(departDuration.asMinutes()) % 60;

                                    var newTotalTime = parseInt(newTotalTime / 60);

                                    if (newTotalTime <= totalTotalMinutes && departDuration.asSeconds() >= 0) {
                                        this.setState({
                                            journey: [...this.state.journey, <ResultJourney key={id} departDays={departDays} departHours={departHours} departMinutes={departMinutes} totalHours={totalHours} totalMinutes={totalMinutes} startDate={startDate} endDate={endDate} returnTicket={returnTicket} onClick={() => this.onJourneyPress(id)} passengers={numPassenger} />]
                                        })
                                    }           
                                })
                        })
                }
            })
    }

    waypointArrayToString = (waypointArray) => {
        var waypoints = ''

        for (let i = 0; i < waypointArray.length; i++) {
            const element = waypointArray[i];

            if (i >= 1) {
                waypoints += `%7C${element.latitude},${element.longitude}`;
                continue;
            }

            waypoints += `${element.latitude},${element.longitude}`
        }

        return waypoints
    }

    navigateTo = () => {
        this.props.navigation.navigate('Home');
    };

    render() {
        const { city, street, endCity, endStreet } = this.props.navigation.state.params;
        return (
            <Container>
                <GlobalHeader type={3} header="Select a Journey" navigateTo={this.navigateTo} isBackButtonActive={1} />
                <Content>
                    <View style={styles.journeyContainer}>
                        <View style={styles.journeyDetails}>
                            <View style={styles.locationContainer}>
                                <Icon name="location-pin" size={20} color={colors.emphasisTextColor} style={{ flex: 1 }} />
                                <Text style={styles.locationText}>{`${street}, ${city}`}</Text>
                            </View>
                            <View>
                                <Icon name="dots-two-vertical" size={20} color={colors.emphasisTextColor} />
                            </View>
                            <View style={styles.locationContainer}>
                                <Icon name="flag" size={20} color={colors.emphasisTextColor} style={{ flex: 1 }} />
                                <Text style={styles.locationText}>{`${endStreet}, ${endCity}`}</Text>
                            </View>
                        </View>
                    </View>
                    {this.state.journey.length > 0 ? this.state.journey : <Text style={styles.noJourneyAvailable}>No journeys' available</Text>}
                    <View style={styles.nothingAvailableContainer}>
                        <Text style={styles.body}>Nothing Available?</Text>
                        <Text style={styles.contactUs}>CONTACT US</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    journeyContainer: {
        padding: 25,
        flexDirection: 'column',
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 0.75
    },
    journeyDetails: {
        flexDirection: 'column',
    },
    locationContainer: {
        flexDirection: 'row'
    },
    locationText: {
        flex: 11,
        fontSize: 15,
        color: colors.emphasisTextColor
    },
    noJourneyAvailable: {
        padding: 15,
        borderBottomColor: colors.lightBorder,
        borderBottomWidth: 0.75,
        width: '100%'
    },
    nothingAvailableContainer: {
        alignItems: "center",
        padding: 25
    },
    contactUs: {
        color: colors.brandColor,
        marginTop: 5
    },
    body: {
        color: colors.bodyTextColor
    }
});

export default ResultScreen