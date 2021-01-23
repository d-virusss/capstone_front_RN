import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen'
import {Alert, View, Text, InputAccessoryView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './views/login/caller';
import Register_form from './views/registration/caller';
import FindId from './views/findid/caller';
import FindPw from './views/findpw/caller';
import Post_provide from './views/post/post_provide';
import Post_ask from './views/post/post_ask';
import SearchBar from './views/post/search_bar';
import PostShow from './views/post/post_show';
import ChatRoom from './views/chat/chat_room2';
import KakaoLogin from './views/login/kakao';
import MyPgae_Location from './views/mypage/location';
import Mypage_Like_List from './views/mypage/likeList';
import ProfileShow from './views/profile/profile';
import ProfileShowList from './views/profile/profile_show_list_dep';
import SettingGroup from './views/mypage/setting_group'
import Booking from './views/booking/booking';
import {fcmService} from './views/shared/FCMService';
import {localNotificationService} from './views/shared/localnotification';
import PostReport from './views/post/post_report'
import MyItemList from './views/mypage/myItemList'
import ManageReservation from './views/mypage/manageReservation'
import PostUpdate from './views/post/post_update'
import Contract from './views/contract/contract'
import Sign from './views/sign/sign'
import SignState from './views/sign/check_sign_state'
import LocationDetail from './views/mypage/location_detail'
import SettingMyInfo from './views/mypage/settingMyInfo'
import ProviderRentList from './views/mypage/provider_rent_list';
import ConsumerRentList from './views/mypage/consumer_rent_list';
import ReportDetail from './views/post/post_report_detail'
import PostUserReport from './views/post/post_user_report'
import Keyword from './views/mypage/keyword'
import Review from './views/mypage/review';
import WriteReview from './views/mypage/write_review'
import Partner_apply from './views/partner/partner_apply';
import Partner_waiting from './views/partner/partner_waiting';
import Partner_page from './views/partner/partner_page';
import UpdateReview from './views/mypage/update_review'
import ProfileProvide from './views/profile/profile_provide'
import ProfileAsk from './views/profile/profile_ask'
import ReceivedReview from './views/profile/received_review'
import FindIdShow from './views/findid/email_show';
import FindPwShow from './views/findpw/pw_show';
import PwInputCode from './views/findpw/pw_input_code'
import AppleLogin from './views/login/appleLogin'
import policyDetail from './views/registration/policyDetail'
import ReservationList from './views/post/reservationList'

import BottomTab from './views/shared/Tab'

import db from './views/shared/chat_db'
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation';

const Stack = createStackNavigator();
var token = '';
let dataNotify={};

const App = () => {
  const [loading, setLoading] = useState();
  var [enterence,setEnterence] = useState("Logins")
  
  useEffect(() => {

    setLoading(loading => true)
    //token = AsyncStorage.getItem('token')
    const asyncFunction=async()=>{
      token = await AsyncStorage.getItem('token')
      console.log(token)
      if(token){
        setEnterence("Main")
      }
    }
    asyncFunction();
    setTimeout(() => {
			SplashScreen.hide();
      setLoading(loading => false)
    }, 800);
    

    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification,dataNotify)

    function onRegister(token){
      console.log("[App] onRegister : ", token)
    }

    function onNotification(notify, data){
      console.log("[App] onNotification: ", notify)
      dataNotify=data;
      console.log(dataNotify)
      const options = {
        soundName: 'default',
        playSound: true
      }
      
      localNotificationService.showNotification(
        0, notify.title, notify.body, notify, options
      )
    }

    function onOpenNotification(notify, data){
      console.log("[App] onOpenNotification: ", notify)
      if(data.type=='keyword'){
        RootNavigation.navigate('PostShow',{post_id:Number(data.post_id)})
      }
      if(data.type=='message'){
        RootNavigation.navigate('ChatRoom',{chat_id:Number(data.chat_id),post_id:Number(data.post_id),nickname:data.user_nickname,avatar:''})
      }

      return () =>{
        console.log("[App] unregister")
        fcmService.unRegister()
        localNotificationService.unregister()
      }
    }
  }, []);

  if(!loading){
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={enterence}>
          <Stack.Screen name="Logins" component={LoginScreen} options={{headerShown: false, gestureEnabled : false, }} />
          <Stack.Screen name="KakaoLogin" component={KakaoLogin} options={{ gestureEnabled : false, headerTitle: "카카오 로그인", headerBackTitle: '뒤로'}} />
          <Stack.Screen name="AppleLogin" component={AppleLogin} options={{ gestureEnabled : false, headerTitle: "Apple 로그인", headerBackTitle: '뒤로'}} />
          <Stack.Screen name="Register" component={Register_form} options={{headerShown: false}} />
          <Stack.Screen name="policyDetail" component={policyDetail} options={{headerShown: false}} />
          <Stack.Screen name="Find_id" component={FindId} options={{headerShown: false}} />
          <Stack.Screen name="FindIdShow" component={FindIdShow} options={{headerShown: false}} />
          <Stack.Screen name="Find_pw" component={FindPw} options={{headerShown: false}} />
          <Stack.Screen name="FindPwShow" component={FindPwShow} options={{headerShown: false}} />
          <Stack.Screen name="PwInputCode" component={PwInputCode} options={{headerShown: false}} />
          <Stack.Screen name="Main" component={BottomTab} options={{headerShown : false, gestureEnabled : false, }}/>
  
          {/* post */}
          <Stack.Screen name="P_W_p" component={Post_provide} options={{ headerShown : false }} />
          <Stack.Screen name="P_W_c" component={Post_ask} options={{ headerShown : false }} />
          <Stack.Screen name="Search" component={SearchBar} />
          <Stack.Screen name="PostShow" component={PostShow}options={{ headerShown: false }}/>
          <Stack.Screen name="PostReport" component={PostReport} options={{headerShown: false,}} />
          <Stack.Screen name="PostUserReport" component={PostUserReport} options={{headerShown: false,}} />
          <Stack.Screen name="ReportDetail" component={ReportDetail} options={{headerShown: false,}} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}} />
          <Stack.Screen name="PostUpdate" component={PostUpdate} options={{headerShown: false}} />
          <Stack.Screen name="Booking" component={Booking} options={{ headerShown : false}} />
          <Stack.Screen name="ReservationList" component={ReservationList} options={{ headerShown : false}} />
  
          {/* mypage */}
          <Stack.Screen name="ProviderRentList" component={ProviderRentList} options={{ headerShown: false, }} />
          <Stack.Screen name="ConsumerRentList" component={ConsumerRentList} options={{ headerShown: false, }} />
          <Stack.Screen name="MyPage_Location" component={MyPgae_Location} options={{headerShown: false}}  />
          <Stack.Screen name="SettingGroup" component={SettingGroup} options={{ headerShown : false}} />
          <Stack.Screen name="Like_List" component={Mypage_Like_List} options={{headerShown: false}}  />
          <Stack.Screen name="MyItemList" component={MyItemList} options={{ headerShown : false }} />
          <Stack.Screen name="Reservation" component={ManageReservation} options={{ headerShown: false }} />
          <Stack.Screen name="LocationDetail" component={LocationDetail} options={{headerShown : false}}/>
          <Stack.Screen name="SettingMyInfo" component={SettingMyInfo} options={{headerShown : false}}/>
          <Stack.Screen name="Keyword" component={Keyword} options={{headerShown : false}}/>
          <Stack.Screen name="Review" component={Review} options={{headerShown : false}}/>
          <Stack.Screen name="WriteReview" component={WriteReview} options={{headerShown : false}}/>
          <Stack.Screen name="UpdateReview" component={UpdateReview} options={{ headerShown: false }} />

          {/* profile */}
          <Stack.Screen name="ProfileShow" component={ProfileShow} options={{ headerShown: false, }} />
          <Stack.Screen name="ProfileProvide" component={ProfileProvide} options={{ headerShown: false, }} />
          <Stack.Screen name="ProfileAsk" component={ProfileAsk} options={{ headerShown: false, }} />
          <Stack.Screen name="ReceivedReview" component={ReceivedReview} options={{ headerShown: false, }} />
  
          <Stack.Screen name="Contract" component={Contract} options={{ headerShown : false }} />
          <Stack.Screen name="Sign" component={Sign} options={{ headerShown : false }} />
          <Stack.Screen name="SignState" component={SignState} options={{ headerShown : false }} />
  
          <Stack.Screen name="Partner_Apply" component={Partner_apply} options={{headerShown : false}}/>
          <Stack.Screen name="Partner_Waiting" component={Partner_waiting} options={{headerShown : false}}/>
          <Stack.Screen name="Partner_Page" component={Partner_page} options={{headerShown : false}}/>
               
        </Stack.Navigator>
      </NavigationContainer>
  
    );
  }
  else{
    return null
  }
};

export default App;