# Transport for Wales - IRT Mobile Application

### A conceptual mobile application built with [ReactNative](https://facebook.github.io/react-native/) 

## Table of contents

* Introduction
* Build status
* Requirements
* Examples
* Installation
* How to run
* Features
* Tests
* Acknowledgements

## Introduction

This application has been built for our client, Transport for Wales, as part of our large-team project module. It represents the work we have carried out over the last 8 weeks as a group.

The objective of this application is to provide a cross-platform mobile application that seamlessly allows users to book transport for a desired journey; introducing means of public transport for residents situated in rural areas; namely, passengers that do not have spontaneous access to commercial, fixed-schedule transport. Through the IRT app, Transport for Wales in conjunction with the Welsh Government seeks to improve transport connectivity, employability and directly influence economical growth.

## Build Status

As of 05/04/2019 - Development has been halted as our project is coming to an end. The ideas and concepts illustrated and developed with the application have been conveyed and delivered to the client with utmost satisfaction. Transport for Wales now seeks to receive funding from the Welsh Government by using the demo we have developed as a 'taster'. Large scale development is now subject to approval by the Welsh Government.

## Examples

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

Firstly, navigate to the *ipstore.js* file which can be found in *server/keys* folder; within this file you need to declare your IPv4 IP address. To find out what this is run:

```
ipconfig
```
and copy in your IPv4 address. This is how it should look:

```javascript
const ip = '111.122.0.33';

module.exports = ip;
```

The IP address is used to post and send API requests (instead of declaring localhost)

By declaring your IP in this file - all the relevant functions & methods now have access to it and can sucessfully operate (make API requests)

**Database**

There are a number of database versions supplied with this repository, this is to show how the database has transitioned over the project-phase. 

Launch MYSQL WorkBench and open *db_version_eleven.sql* and *db_data_version_eleven.sql* - Both these files can be found in the *database/version_eleven* folder

Run the schema: ```db_version_eleven``` 

Consequently run: *db_data_version_eleven*

**Expo Login**

Head on back to the root directory and within the terminal or shell you have open run the following command:

```
expo login
```

Enter your Expo account details to login to your Expo account

**API Keys**

In relation to convinience and efficiency, the team has provided you with a Paypal API key, Nodemailer Key and a Google Maps API key. These can be found in the keys folder and should fully work; namely, API requests should be sucessfully made with these keys. Normally, such API keys would not be shared, however as the repository is private we found it suitable. 

## How to run

*While there are commands in place to simplify running the application, such as concurrently running the app/server, this following list of steps will start from the basics:*





