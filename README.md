# 모두나눔_FRONT

<p align="center"><a href="https://www.applepink.ml" target="_blank" rel="noopener noreferrer"><img width="150" src="https://www.applepink.ml/image/default.png" alt="Framework7"></a></p>

<h1 align="center">모두나눔</h1>

<p align="center">
  <a href="https://www.applepink.ml" target="_blank">위치 기반 C2C 공유 플랫폼</a>
</p>


## Collaborator

| [<img src="https://avatars3.githubusercontent.com/u/55905801?s=400&v=4" width="200">](https://github.com/d-virusss) <br> d-virusss| [<img src="https://avatars1.githubusercontent.com/u/55075628?s=400&v=4" width="200">](https://github.com/miny-kim) <br> miny-kim | [<img src="https://avatars3.githubusercontent.com/u/56245165?s=400&v=4" width="200">](https://github.com/ajkenny122) <br> ajkenny122 |
| :-----------------------------------: | :---------------------------------------: | :---------------------------------------: |

## Intro
This repository is Modunanum's Front-end repository built with **React Native**.
  
You can find our [Back-end repo](https://github.com/oohyun15/applePink-backend) built with **Ruby on Rails**.
*updated : 2021.02.21*

## Requirements
#### Common factors
* react-native-cli: 2.0.1
* react-native: 0.63.2
* npm : 6.14.9
* node : v15.2.0
* Target SDK : 29

#### For Android
* Android Studio : 4.1.2
* Android 10.0(Q)
* Android SDK Platform 29
* Sources for Android 29
* Intel x86 Atom_64 System Image
* Google APIs Intel x86 Atom_64 System Image

#### For iOS
* Xcode : 12.1
* CocoaPod : 1.9.3

## third-party API
* Kakao Developer    *[(link)](https://developers.kakao.com/)*
* Apple Developer    *[(link)](https://developer.apple.com/)*
* Firebase           *[(link)](https://firebase.google.com/)*
* Amazon Web Service *[(link)](https://aws.amazon.com/)*
* Sendgrid           *[(link)](https://sendgrid.com/)*
* Cafe24             *[(link)](https://hosting.cafe24.com/)*
* Kakaocert          *[(link)](https://www.kakaocert.com/)*
* Cloudmersive       *[(link)](https://cloudmersive.com/)*
* Sentry             *[(link)](https://sentry.io/)*

## Features
#### OAuth Social Sign-in
* Kakao
* Apple

#### Regional Certification
* Google Maps
* Kakao Maps (for converting GPS coordinates to a legal county)
  * Currently support Suwon only (57 counties)

#### 1:1 Chatting
* Firebase realtime database

#### Keyword Notification
* Up to 20 registered
* FCM (Android & Apple)
* APNS (Apple only)

#### Electronic Signature
* Kakaocert

#### Email & SMS Notification
* Sendgrid (Email)
* Cafe24 (SMS)

#### Association Certification
* University
  * Support 108 universities in Korea

#### Converting from HEIC to PNG 
* Cloudmersive

#### Administrator Page
* Activeadmin

## Getting Started
**1. Install npm modules**
```zsh
# install npm modules
npm install
```

**2. Set secret keys**
``` zsh
# for kakao map API key
# in views/key.js
const APP_KEY = "..."

export default APP_KEY;
```

``` zsh
# for google map API key
# you should specify api key value in ios/repo_name/AppDelegat.m
```

**3. Run local server and run emulator**
``` zsh
react-native run-ios
or
react-native run-android
# You should turn on android emulator before run this command
```
