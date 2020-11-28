import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import React, { useEffect, ReactElement } from 'react';
import {Icon} from 'native-base'
import MyPage from '../mypage/lobby';
import PostIndex from '../post/index'
import chatIndex from '../chat/chat_index';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
IconM.loadFont();

const Tab = createBottomTabNavigator();

function TabScreen() {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={PostIndex}
         options={{
            tabBarLabel: '홈',
            tabBarIcon: ({focused, color}) => {
                return(<Icon name="home-outline" size={13} style={{color: focused ?  color : 'black'}} />);}}} 
        tabBarOptions= {{
            activeTintColor: '#000',
            inactiveTintColor: '#fff',
          }}/>

        <Tab.Screen name="Home1" component={PostIndex}
        options={{
            tabBarLabel: '지역/소속 게시판',
            tabBarIcon: ({focused, color}) => {
                return(<Icon name="pencil-outline" type="MaterialCommunityIcons" size={13} style={{color: focused ?  color : 'black'}}/>);}}} />

        <Tab.Screen name="Chat" component={chatIndex} 
        options={{
            tabBarLabel: '채팅',
            tabBarIcon: ({focused, color}) => {
                return(<Icon name="chat-outline" type="MaterialCommunityIcons" size={13} style={{color: focused ?  color : 'black'}}/>);} }}/>

        <Tab.Screen name="MyPage" component={MyPage}
        options={{
            tabBarLabel: '마이페이지',
            tabBarIcon: ({focused, color}) => {
                return(<Icon name="person-outline" size={13} style={{color: focused ?  color : 'black'}}/> );}}} />
    </Tab.Navigator>
  );
}

export default TabScreen;