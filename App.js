import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Alert, View, Text} from 'react-native';
import React, { useEffect, ReactElement } from 'react';
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
import MyPage from './views/mypage/lobby';
import KakaoLogin from './views/login/kakao';
import MyPgae_Location from './views/mypage/location';
import Mypage_Like_List from './views/mypage/likeList';
import ProfileShow from './views/mypage/profile';
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

import ButtomTab from './views/shared/Tab'

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token){
      console.log("[App] onRegister : ", token)
    }

    function onNotification(notify){
      console.log("[App] onNotification: ", notify)
      const options = {
        soundName: 'default',
        playSound: true
      }
      localNotificationService.showNotification(
        0, notify.title, notify.body, notify, options
      )
    }

    function onOpenNotification(notify){
      console.log("[App] onOpenNotification: ", notify)
      Alert.alert(notify.title, notify.body,[{text:'확인', style:'cancel'}])

      return () =>{
        console.log("[App] unregister")
        fcmService.unRegister()
        localNotificationService.unregister()
      }
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logins">
        <Stack.Screen name="Logins" component={LoginScreen} options={{headerShown: false, gestureEnabled : false, }} />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} options={{ gestureEnabled : false, headerTitle: "카카오 로그인", headerBackTitle: '뒤로'}} />
        <Stack.Screen name="Register" component={Register_form} options={{headerShown: false}} />
        <Stack.Screen name="Find_id" component={FindId} options={{headerShown: false}} />
        <Stack.Screen name="Find_pw" component={FindPw} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={ButtomTab} options={{headerShown : false, gestureEnabled : false, }}/>

        {/* post */}
        <Stack.Screen name="P_W_p" component={Post_provide} options={{ headerShown : false }} />
        <Stack.Screen name="P_W_c" component={Post_ask} options={{ headerShown : false }} />
        <Stack.Screen name="Seach" component={SearchBar} />
        <Stack.Screen name="PostShow" component={PostShow}options={{ headerShown: false }}/>
        <Stack.Screen name="PostReport" component={PostReport} options={{headerShown: false,}} />
        <Stack.Screen name="PostUserReport" component={PostUserReport} options={{headerShown: false,}} />
        <Stack.Screen name="ReportDetail" component={ReportDetail} options={{headerShown: false,}} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}} />
        <Stack.Screen name="PostUpdate" component={PostUpdate} options={{headerShown: false}} />
        <Stack.Screen name="Booking" component={Booking} options={{ headerShown : false}} />


        {/* mypage */}
        <Stack.Screen name="ProviderRentList" component={ProviderRentList} options={{ headerShown: false, }} />
        <Stack.Screen name="ConsumerRentList" component={ConsumerRentList} options={{ headerShown: false, }} />
        <Stack.Screen name="MyPage_Location" component={MyPgae_Location} options={{gestureEnabled: false, headerShown: false}}  />
        <Stack.Screen name="SettingGroup" component={SettingGroup} options={{ headerShown : false}} />
        <Stack.Screen name="Like_List" component={Mypage_Like_List} options={{headerShown: false}}  />
        <Stack.Screen name="ProfileShow" component={ProfileShow} options={{ headerShown : false, }} />
        <Stack.Screen name="ProfileShowList" component={ProfileShowList} options={{ headerShown : false, }} />
        <Stack.Screen name="MyItemList" component={MyItemList} options={{ headerShown : false }} />
        <Stack.Screen name="Reservation" component={ManageReservation} options={{ headerShown: false }} />
        <Stack.Screen name="LocationDetail" component={LocationDetail} options={{headerShown : false}}/>
        <Stack.Screen name="SettingMyInfo" component={SettingMyInfo} options={{headerShown : false}}/>
        <Stack.Screen name="Keyword" component={Keyword} options={{headerShown : false}}/>
        <Stack.Screen name="Review" component={Review} options={{headerShown : false}}/>
        <Stack.Screen name="WriteReview" component={WriteReview} options={{headerShown : false}}/>
        <Stack.Screen name="UpdateReview" component={UpdateReview} options={{headerShown : false}}/>


        <Stack.Screen name="Contract" component={Contract} options={{ headerShown : false }} />
        <Stack.Screen name="Sign" component={Sign} options={{ headerShown : false }} />
        <Stack.Screen name="SignState" component={SignState} options={{ headerShown : false }} />

        <Stack.Screen name="Partner_Apply" component={Partner_apply} options={{headerShown : false}}/>
        <Stack.Screen name="Partner_Waiting" component={Partner_waiting} options={{headerShown : false}}/>
        <Stack.Screen name="Partner_Page" component={Partner_page} options={{headerShown : false}}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default App;