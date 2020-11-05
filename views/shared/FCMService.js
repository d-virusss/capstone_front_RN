import firebase from '@react-native-firebase/messaging'
import {Platfrom} from 'react-native'
import {Notification, NotificationOpen} from 'react-native-firebase';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister)
    this.createNotificationListeners(onRegister,onNotification, onOpenNotification)
  }

  registerAppWithFCM = async() => {
    if(Platfrom.OS === 'ios'){
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  }

  checkPermission = (onRegister) => {
    messaging().hasPermission()
    .then(enabled => {
      if(enabled) {
      //인증됨
      this.getToken(onRegister)
      }
      else {
        this.requestPermission(onRegister)
      }
    })
    .catch(error => {
      console.log("[FCMService] Permission rejected ", error)
    })
  }

  getToken = (onRegister) => {
    messaging().getToken()
    .then(fcmToken => {
      if(fcmToken){
        onRegister(fcmToken)
      }
      else{
        console.log("no device token")
      }
    })
    .catch(error => {
      console.log("token rejected", error)
    })
  }

  requestPermission = (onRegister) => {
    messaging().requestPermission()
    .then(() => {
      this.getToken(onRegister)
    })
    .catch(error => {
      console.log("request permission rejected", error)
    })
  }

  deleteToken = () => {
    console.log("delete token")
    messaging().deleteToken()
    .catch(error => {
      console.log("delete error ", error)
    })
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    this.notificationListner = firebase.notifications()
    .onNotification((notification: Notification) => {
      onNotification(notification)
    })

    this.notificationOpenedListner = firebase.notifications()
    .onNotificationOpened((notificationOpen: NotificationOpen) => {
      onOpenNotification(notification)
    })

    firebase.notifications().getInitialNotification()
    .then(notificationOpen => {
      const notification: Notification = notificationOpen.notification
      onOpenNotification(notification)
    })

    this.messageListner = firebase.messaging().onMessage((message) => {
      onNotification(message)
    })

    this.onTokenRefreshListner = firebase.messaging().onTokenRefresh(fcmToken => {
      console.log('new token ', fcmToken)
      onRegister(fcmToken)
    })
  }

  unRegister = () => {
    this.notificationListner();
    this.messageListner();
    this.messageListner();
    this.onTokenRefreshListner();
  }

  buildChannel = (obj) => {
    return new firebase.notifications.Android.Channel(
      obj.channelID, obj.channelName,
      firebase.notifications.Android.Importance.High
      .setDescirption(obj.channelDes)
    )
  }

  buildNotification = (obj) => {
    firebase.notifications().android.createChannel(obj.channel)

    return new firebase.notifications.Notification()
    .setSound(obj.sound)
    .setNotificationId(obj.dataId)
    .setTitle(obj.title)
    .setBody(obj.content)
    .setData(obj.data)
    //android
    .android.setChannelId(obj.channel.channelID)
    .android.setLargeIcon(obj.largeIcon)
    .android.setSmallIcon(obj.smallIcon)
    .android.setColr(obj.colorBgIcon)
    .android.setPriority(firebase.notifications.Android.Priority.High)
    .android.setVibrate(obj.vibrate)
  }

  scheduleNotification = (notification, days, minutes) => {
    const date = new Date()
    if (days){
      date.setDate(date.getDate()+days)
    }
    if(minutes){
      date.setMinutes(date.getMinutes() + minutes)
    }

    firebase.notifications()
    .scheduleNotification(notification, {fireDate: date.getTime()})
  }

  displayNotification = (notification) => {
    firebase.notifications().displayNotification(notification)
    .catch(error => console.log("Display Notification error: ", error))
  }

  removeDeliveredNotification = (notification) => {
    firebase.notifications()
    .removeDeliveredNotification(notification.notificationId)
  }
}

export const fcmService = new FCMService()