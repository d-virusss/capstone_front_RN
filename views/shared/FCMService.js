import messaging from '@react-native-firebase/messaging'
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class FCMService {

    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
    }

    registerAppWithFCM = async() => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true)
        } 
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
        .then(enabled => {
            if (enabled) { 
                // User has permissions
                this.getToken(onRegister)
            } else {
                // User doesn't have permission
                this.requestPermission(onRegister)
            }
        }).catch(error => {
            console.log("[FCMService] Permission rejected ", error)
            Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        })
    }

    saveFCMToken = async(fcmToken) => {
        await AsyncStorage.setItem('fcmToken', fcmToken);
    }

    getToken = (onRegister) => {
        messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
                this.saveFCMToken(fcmToken);
                console.log("this is token : " + fcmToken);
                onRegister(fcmToken)
            }else {
                console.log("[FCMService] User does not have a device token")
            }
        }).catch(error => {
            console.log("[FCMService] getToken rejected ", error)
            Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        })
    }

    requestPermission = (onRegister) => {
         messaging().requestPermission()
        .then(() => {
            this.getToken(onRegister)
        }).catch(error => {
            console.log("[FCMService] Request Permission rejected ", error)
            Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        })
    }

    deleteToken = () => {
        console.log("[FCMService] deleteToken ")
        messaging().deleteToken()
        .catch(error => {
            console.log("[FCMService] Delete token error ", error)
            Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    
        // When the application is running, but in the background
        messaging()
        .onNotificationOpenedApp(remoteMessage => {
            console.log('[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',remoteMessage)
            if (remoteMessage) {
                const notification = remoteMessage.notification
                const data = remoteMessage.data
                onOpenNotification(notification, data)
                // this.removeDeliveredNotification(notification.notificationId)
            }
        });

         // When the application is opened from a quit state.
        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            console.log('[FCMService] getInitialNotification Notification caused app to open from quit state:',remoteMessage)

            if (remoteMessage) {
                const notification = remoteMessage.notification
                const data = remoteMessage.data
                onOpenNotification(notification, data)
                //  this.removeDeliveredNotification(notification.notificationId)
            }
        });

        // Foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log('[FCMService] A new FCM message arrived!', remoteMessage);
            
            let notification = null;
            let data = null;
            notification = remoteMessage.notification;
            data = remoteMessage.data;
            console.log('[fcmsss] : '+ JSON.stringify(data))
            onNotification(notification, data)
            
        });

        // Triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            console.log("[FCMService] New token refresh: ", fcmToken)
            onRegister(fcmToken)
        })

    }

    unRegister = () => {
        this.messageListener()
    }
}

export const fcmService = new FCMService()