import {NavigationContainer} from '@react-navigation/native';
import {Alert} from 'react-native';
import React, {Component, Fragment, useEffect} from 'react';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {Button, Icon} from 'native-base';
import messaging from '@react-native-firebase/messaging';

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
import PostShow from './views/post/postshow';
import ProvideIndex from './views/post/provide_index';
import ChatRoom from './views/chat/chat_room';
import MyPage from './views/mypage/caller';
import KakaoLogin from './views/login/kakao';
import MyPgae_Location from './views/mypage/location';
import Mypage_Like_List from './views/mypage/likeList';
import ProfileShow from './views/profile/profile_show';
import ProfileShowList from './views/profile/profile_show_list';
import ProfilePostShow from './views/profile/profile_post_show';
import Booking from './views/booking/booking';

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logins">
        <Stack.Screen
          name="Logins"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
        <Stack.Screen name="Register" component={Register_form} />
        <Stack.Screen name="Find_id" component={FindId} />
        <Stack.Screen name="Find_pw" component={FindPw} />
        <Stack.Screen
          name="postIndex"
          component={PostIndex}
          options={{headerShown: false}}
        />
        <Stack.Screen name="C_index" component={C_I} />
        <Stack.Screen
          name="Chats"
          component={chatIndex}
          options={{
            title: '채팅',
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="P_W_p"
          component={Post_provide}
          options={{
            headerTitle: '대여글 쓰기',
            headerTitleStyle: {fontSize: 25},
          }}
        />
        <Stack.Screen
          name="P_W_c"
          component={Post_ask}
          options={{
            headerTitle: '대여요청글 쓰기',
            headerTitleStyle: {fontSize: 25},
          }}
        />
        <Stack.Screen name="Seach" component={SearchBar} />
        <Stack.Screen name="PostShow" component={PostShow} />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPage_Location"
          component={MyPgae_Location}
          options={{
            headerTitle: '동네 설정',
            headerTitleStyle: {fontSize: 25},
          }}
        />

        <Stack.Screen
          name="Like_List"
          component={Mypage_Like_List}
          options={{
            headerTitle: '관심 목록',
            headerTitleStyle: {fontSize: 25},
          }}
        />
        <Stack.Screen
          name="ProfileShow"
          component={ProfileShow}
          options={{
            headerShown : false,
          }}
        />
        <Stack.Screen
          name="ProfileShowList"
          component={ProfileShowList}
          options={{
            headerShown : false,
          }}
        />
        <Stack.Screen
          name="ProfilePostShow"
          component={ProfilePostShow}
        />
        <Stack.Screen
          name="Booking"
          component={Booking}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
