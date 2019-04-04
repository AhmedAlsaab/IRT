# Transport for Wales - IRT Mobile Application

### A conceptual mobile application built with [ReactNative](https://facebook.github.io/react-native/) 

## Table of contents

* Introduction
* Build status
* Requirements
* Examples
* Installation
* How to run
* FAQ
* Contributors

## Introduction

This application has been built for our client, Transport for Wales, as part of our large-team project module. It represents the work we have carried out over the last 8 weeks as a group.

The objective of this project is to provide a cross-platform mobile application that seamlessly allows users to book transport for a desired journey; introducing means of public transport for residents situated in rural areas; namely, passengers that do not have spontaneous access to commercial, fixed-schedule transport. Through the IRT app, Transport for Wales in conjunction with the Welsh Government seeks to improve transport connectivity, employability and directly influence economical growth.

## Build Status

As of 05/04/2019 - Development has been halted as our project is coming to an end. The ideas and concepts illustrated and developed with the application have been conveyed and delivered to the client with utmost satisfaction. Transport for Wales now seeks to receive funding from the Welsh Government by using the demo we have developed as a 'taster'. Large scale development is now subject to approval by the Welsh Government.

## Examples

### Tracking a driver

```Javascript
	// Socket connection -- connecting passengers to a vehicle tracking socket in the server
	// Retrieving data from the driver side via the driver to passenger socket
	async checkDriver() {
		const socket = socketIO.connect(`http://${ip}:3000`);
		socket.on('connect', () => {
			console.log('client connected');
			socket.emit('trackVehicle');
		});

		socket.on('driverLocation', (driverLocation) => {
			const pointCoords = [ ...this.state.pointCoords, driverLocation ];
			const { latitude, longitude } = this.props.navigation.state.params;
			this.setState({
				isDriverOnTheWay: true,
				driverLocation: driverLocation
			});

			// Check if the driver's (point) position is within x amount of metre from user's position
			let isNearby = geolib.isPointInCircle(
				// Vehicle Position
				{ latitude: driverLocation.latitude, longitude: driverLocation.longitude },
				// Point/User Position (checking if above has entered region below)
				{ latitude: this.state.lat, longitude: this.state.long },
				// Radius in metre
				20
			);
			// If if it's true or false, set state and distance
			if (isNearby === true) {
				let distance = geolib.getDistance(
					// User Position
					{ latitude: driverLocation.latitude, longitude: driverLocation.longitude },
					// Point Position
					{ latitude, longitude }
				);
				this.setState({
					withinRadius: 'Yes',
					Distance: distance
				});
				console.log('ENTERED REGION', distance);
				this.sendPushNotification();
			} else {
				this.setState({
					withinRadius: 'No',
					Distance: 'Unknown'
				});
			}
		});
	}
```
### JWT Authentication
```Javascript


var jwt = require('jsonwebtoken');
var config = require('./config');

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        if (token === 'undefined') reject(error);
        jwt.verify(token, config.jwtsecret, (error, decoded) => {
            if (error || !decoded) {
                return reject(error);
            } else return resolve(decoded);
        });
    });
}

function createJWTToken(id) {
    return jwt.sign({ id: id }, config.jwtsecret, { expiresIn: 86400, algorithm: 'HS256' });
}

function verifyJWTRESTRequest(req, res, next) {
    if (req.headers.authorization === undefined)
        return res.status(400).send({ message: 'Invalid auth token provided.' });

    verifyJWTToken(req.headers.authorization.split(' ')[1])
        .then((token) => {
            req.userId = token.id;
            next();
        })
        .catch((error) => {
            return res.status(400).json({ message: 'Invalid auth token provided.' });
        });
}

module.exports = {
    createJWTToken,
    verifyJWTRESTRequest
};
```
### Validating vehicle additions

```Javascript
app.post('/driver/vehicles/addVehicle', (req, res) => {
	//Check for errors in user input
	req.checkBody('make', 'Make cannot be empty').trim().notEmpty();
	req.checkBody('model', 'Model cannot be empty').trim().notEmpty();
	req.checkBody('registration', 'Registration cannot be empty').trim().notEmpty();
	req.checkBody('registration', 'Must be a valid UK vehicle registration')
		.matches(/^([A-Z]{3}\s?(\d{3}|\d{2}|d{1})\s?[A-Z])|([A-Z]\s?(\d{3}|\d{2}|\d{1})\s?[A-Z]{3})|(([A-HK-PRSVWY][A-HJ-PR-Y])\s?([0][2-9]|[1-9][0-9])\s?[A-HJ-PR-Z]{3})$/).trim();
	req.checkBody('numPassengers', 'Number of seats cannot be empty').trim().notEmpty();
	req.checkBody('numPassengers', 'Number of seats must be a numerical value').isNumeric();
	req.checkBody('numWheelchairs', 'Number of wheelchairs must be a numerical value').isNumeric();
	req.checkBody('vehicleType', 'Please select a vehicle type').not(1 || 2 || 3 || 4);

	//Send errors back to client
	const errors = req.validationErrors();
	if (errors) {
		return res.send({ status: 0, errors: errors });
	}

	const make = req.body.make;
	const model = req.body.model;
	const registration = req.body.registration;
	const numPassengers = req.body.numPassengers;
	const numWheelchairs = req.body.numWheelchairs;
	const vehicleType = req.body.vehicleType;
	const userId = localStorage.getItem('userId');

	connection.query(
		`INSERT INTO vehicle (make, model, registration, passenger_seats, wheelchair_spaces, currently_driven, fk_vehicle_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[make, model, registration, numPassengers, numWheelchairs, 0, vehicleType],
		(error, row, fields) => {
			if (error) throw error;

			connection.query(
				`INSERT INTO user_vehicle (fk_user_id, fk_vehicle_id) VALUES (?, ?)`,
				[userId, row.insertId],
				(error, row, fields) => {
					if (error) throw error;
					else {
						res.send({ status: 10 });
					}
				}
			);
		}
	);
});
```

## Requirements

 [Node.js](https://nodejs.org/en/)

To check if you have Node.js installed, run this command in your terminal
```bash
node -v
```

To confirm that you have npm installed you can run this command in your terminal
```bash
npm -v
```
[Expo](https://docs.expo.io/versions/latest/introduction/installation/)

```
npm install -g expo-cli
```
To confirm that you have expo installed you can run this command in your terminal
```bash
expo -v
```

Finally, to view and interact with some of the advanced functionality, such as push-notifications, an Expo account is required. You can set a free account up [here](https://expo.io/signup)

[MYSQL WorkBench](https://dev.mysql.com/downloads/workbench/)

Generally, the recomended installation is a good choice to download
>To be able to install and run MySQL Workbench on Windows your system needs to have libraries listed below installed. The listed items are provided as links to the corresponding download pages where you can fetch the necessary files.
>* [Microsoft .NET Framework 4.5](https://www.microsoft.com/en-us/download/details.aspx?id=30653)
>* [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145)

**Running  an Expo App on your device**

[Download for Android from the Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [for iOS from the App Store](https://search.itunes.apple.com/WebObjects/MZContentLink.woa/wa/link?path=apps%2fexponent)

>**Required Android and iOS versions**: The minimum Android version Expo supports is Android 5 and the minimum iOS version is iOS 10.0.

**Emulator/Simulator - Android**

Follow the Expo [Adnroid Studio emulator guide](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/) to set up Android tools and create a virtual device. Start up the virtual device when it's ready.

You don't need to manually install the Expo client on your emulator/simulator, because Expo CLI will do that automatically (more on this later, but once the application launches it should automatically install Expo if you don't have it on the emulator)

A suggestion is to use SDK 28: Pixel 2 XL or Nexus 6

**Emulator/Simulator - iOS**

Install [Xcode through the Apple app store](https://itunes.apple.com/app/xcode/id497799835). Next, open up Xcode, go to preferences and click the Components tab, install a simulator from the list.

Once the simulator is open and you have a project open in Expo Dev Tools, you can press Run on iOS simulator in Expo Dev Tools and it will install the Expo Client to the simulator and open up your app inside of it (more on this later)


## Installation

1. Clone the repository or download and extract the ZIP

2. Inside the root directory (this is where app.js resides) open up a shell/terminal and run the following:
```bash
npm install
```

If npm is not a recognized command, ensure you have sucessfully installed  [Node.js](https://nodejs.org/en/)

## Setup

Before we go into how to run the application, there are a few things that need to be setup. 

**IP Address**

Firstly, navigate to the ```ipstore.js``` file which can be found in ```server/keys``` folder; within this file you need to declare your IPv4 IP address. To find out what this is run:

```
ipconfig
```
and copy in your IPv4 address. This is how it should look (where x represents IP Address):

```javascript
const ip = 'xxx.xxx.x.xx';

module.exports = ip;
```

The IP address is used to post and fetch API requests (instead of declaring localhost)

By declaring your IP in this file - all the relevant functions & methods now have access to it and can sucessfully operate (make API calls)

**Database**

There are a number of database versions supplied with this repository, this is to show how the database has transitioned over the project-phase. 

Launch MYSQL WorkBench open the ```database/version_eleven``` folder

Import and run the schema: ```db_version_eleven``` 

Consequently import and run: ```db_data_version_eleven```

**Database Credentials**

Open the ```server.js``` file which can be found in the ```server``` folder.

Adjust the credentials to match your MYSQL WorkBench credentials. The IP found below is our localhost.

```Javascript
var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'transport',
	password: ''
});
```


**API Keys**

In relation to convenience and efficiency, the team has provided you with a Paypal API key, Nodemailer Key and a Google Maps API key. These can be found in the keys folder and should fully work; namely, API requests should be sucessfully made with these keys. Normally, such API keys would not be shared, however as the repository is private we found it suitable. 

## How to run

*While there are commands in place to simplify running the application, such as concurrently running the app/server, this following list of steps will start from the basics:*



**Optional**

Run ```setup.sh``` - This is a supplementary script that re-installs everything. We usually run this after a fresh clone to ensure all dependencies are installed based on ```package.json```

```
$./setup.sh
```

**Compulsary**

Enter your Expo account details to login to your Expo account
```
expo login
```

Starting the application from the root directory:

```
expo start
```
Launching the server from the root directory:
```
nodemon server/server.js
```
**Expo Interface**

After launching the application, you should have a web interface open automatically. This interface acts as an interactive menu where you are able to run the application through different means and methods. Additionally, ensure Node.JS has sufficient access by checking your firewall (if you are thinking of running on device)

![Expo Interface Screenshot 1](https://i.imgur.com/ayUfsJq.png)

**Andriod Emulator**

>Run on Adroid device/emulator

**iOS Simulator**
> Run on iOS simulator

**Android Device**

Assuming Expo is installed on your device:

>Scan QR code

**iOS Device**

Assuming Expo is installed on your device:

>Open the camera application on your Iphone and scan the QR code

## FAQ

> Invalid SDK, Response 500 & Missing dependencies

* Check that Node.js can bypass the firewall
* Run setup.sh
* This project runs Expo SDK 31

> Nothing happens when I press the login / register button

* Check that the server is running 
* Ensure you are running the specified database version
* Verify that Node.js can bypass the firewall
* Have you entered the correct IP address in the ```ipstore.js``` file ?

>The server crashed

* Could be a number of problems, most commonly related your SQL credentials

> When I enter a destination, no suggestion list appears

* Is the provided Google Maps API key not working? 
* Run a basic request via Postman to see if the key is working

> I don't get a result after searching for a journey

* Right now you can only retrieve a result if you enter 'South Clive Street' in the destination (to, not from) 
* The starting location (from) can be as you wish

> Error when adding funds via Paypal, related to /views

* This is a common issue. Adjust the following in the ```server.js``` file
```Javascript
app.set('views', './views');
```
to 

```Javascript
app.set('views', '../views');
```

> I did not receive a push-notification

* Ensure that you are logged in to expo prior to booking a journey
* Ensure that notification & location permissions have been granted

or the other way around

> The map is blank or not working

* Check the Google Maps API key

> My location is invalid on the map

* This depends on the location you have set on the emulator
* You can adjust it in the emulator's settings
* If you are using a device, ensure the relevant permissions have been given

> How do I access the driver's end point?

* Create a driver account by selecting 'driver' in the registartion form

> How do I access the driver's route screen?

* Click the map in the list of stops on the driver's side
* This can be found at the bottom of the list of stops screen

> Tracking a driver doesn't work

* You need to setup two emulators for this to work
* You need to be on track driver screen and the driver's route screen simultaniously
* When you select 'start route' the socket is ready, you should see a bus icon on both emulators (driver and passenger)
* In your android emulator you can use the GPX file in the ```mockRoutes``` folder to pass in a range of locations
* Pressing the play button after importing the above file will start moving your device
* Locations updates should then be shown on each respective end-point
* Similarly, for iOS you can press the mock movement button in the simulator options

>Couldn't get GCM token: Warning

* This means you have not logged in to Expo and therefore, the device's token could not be retrieved

>Unrecognized Web-Scoket

* This generally means that one socket connection is not active
* This typically means that you are not on both screens 

> Initial map region cannot be null: Warning
* This has to do with the component's loading speed and is typically not a application-breaking warning
## Contributors

Oliver Simon

Ahmed Alsaab

Laura Vuilleumier

Idunah Araneta

Konstantinos-Marinos Papathanasiou

## License

[MIT License]()

