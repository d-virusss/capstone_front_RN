import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
class LocalNotificationService {

  configure = (onOpenNotification) => {
    onRegister: function (token){
      console.log("[LocalNotificationService] onRegister:", token);
    },
    onNotification: function (notification) {
      console.log("notification", notification);
      if(!notification?.data){
        return
      }
      notification.userInterface = true;
      onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

      if(Platform.OS === 'ios'){
        notification.finish(PushNotificationIOS.FetchResult.NoData)
      }
    },

    permissions:{
      alert : true,
      badge: true,
      sound, true
    },

    popInitialNotification: true,
    requestPermissions: true,
  }

  unregister = () => {
    PushNotification.unregister()
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.buildAndroidNotification({
    ...this.buildAndroidNotification(id, title, message, data, options),
    title: title || "",
    message : message || "",
    userInterface: false //Boolean if the notification was opened by the user from the notification
    });
  }

  buildAndroidNotification = (id, title, message, data ={}, options={}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "ic_launcher",
      smallIcon: options.smallIcon || "ic_notification",
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || "300",
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    }
  }

  buildIOSNotification = (id, title, message, data={}, options={}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || "",
      userInfo: {
        id: id,
        item: data
      }
    }
  }

  cancelAllLocalNotifications = () => {
    if(Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    }
    else{
      PushNotification.cancelAllLocalNotifications();
    }
  }

  removeDeliveredNotificationByID = (notificationId) => {
    console.log(notificationId);
    PushNotification.cancelLocalNotifications({id: `${notificationId}`})
  }
}

export const LocalNotificationService = new LocalNotificationService()