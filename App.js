import {NavigationContainer} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import React, {Component, Fragment} from 'react';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {Icon, Button} from 'native-base';
import LoginScreen from './views/login/caller';
import Register_form from './views/registration/caller';
import FindId from './views/findid/caller';
import FindPw from './views/findpw/caller';
import PostIndex from './views/post/index';
import C_I from './views/post/category_index';
import Post_provide from './views/post/post_provide';
import Post_ask from './views/post/post_ask';
import SearchBar from './views/post/search_bar';
import chatIndex from './views/chat/chat_index';
import PostShow from './views/post/post_show';
import ChatRoom from './views/chat/chat_room';
import MyPage from './views/mypage/caller';
import KakaoLogin from './views/login/kakao';
import MyPgae_Location from './views/mypage/location';
import Mypage_Like_List from './views/mypage/likeList';
import ProfileShow from './views/profile/profile_show';
import ProfileShowList from './views/profile/profile_show_list';
import SettingGroup from './views/mypage/setting_group'
import Booking from './views/booking/booking';
import PostReport from './views/post/post_report'
import MyItemList from './views/mypage/myItemList'
import ManageReservation from './views/mypage/manageReservation'
import PostUpdate from './views/post/post_update'

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logins">
        <Stack.Screen name="Logins" component={LoginScreen} options={{headerShown: false, gestureEnabled : false}} />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} options={{gestureEnabled : false}} />
        <Stack.Screen name="Register" component={Register_form} />
        <Stack.Screen name="Find_id" component={FindId} />
        <Stack.Screen name="Find_pw" component={FindPw} />

        <Stack.Screen name="C_index" component={C_I} />
        <Stack.Screen name="Chats" component={chatIndex} options={{ title: '채팅', headerLeft: null, }} />
        <Stack.Screen name="P_W_p" component={Post_provide} options={{ headerShown : false }} />
        <Stack.Screen name="P_W_c" component={Post_ask} options={{ headerShown : false }} />
        <Stack.Screen name="Seach" component={SearchBar} />
        <Stack.Screen name="postIndex" component={PostIndex} options={{ headerTitle:'', headerShown: false}} />
        <Stack.Screen name="PostShow" component={PostShow}options={{ headerShown: false }}/>
        <Stack.Screen name="PostReport" component={PostReport} options={{headerTitle: "신고하기",}} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}} />
        <Stack.Screen name="PostUpdate" component={PostUpdate} options={{headerShown: false}} />

        <Stack.Screen name="MyPage" component={MyPage} options={{headerShown: false}} />
        <Stack.Screen name="MyPage_Location" component={MyPgae_Location} options={{ headerTitle: '동네 설정', headerTitleStyle: {fontSize: 25}, }} />
        <Stack.Screen name="SettingGroup" component={SettingGroup} options={{ headerTitle: '소속 인증', headerTitleStyle: {fontSize: 25}, }} />
        <Stack.Screen name="Like_List" component={Mypage_Like_List} options={{ headerTitle: '관심 목록', headerTitleStyle: {fontSize: 25}, }} />
        <Stack.Screen name="ProfileShow" component={ProfileShow} options={{ headerShown : false, }} />
        <Stack.Screen name="ProfileShowList" component={ProfileShowList} options={{ headerShown : false, }} />
        <Stack.Screen name="Booking" component={Booking} />
        <Stack.Screen name="MyItemList" component={MyItemList} />
        <Stack.Screen name="Reservation" component={ManageReservation} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
