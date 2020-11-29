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
            tabBarLabel: '',
            tabBarIcon: ({focused, color}) => {
              if(focused){
                return(<Icon name="home" size={13}/>)
              }else{
                return(<Icon name="home-outline" size={13}/>)}
              }
            }} 

          tabBarOptions= {{
            activeTintColor: '#000',
            inactiveTintColor: '#fff',
          }}/>

        <Tab.Screen name="Home1" component={PostIndex}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused, color}) => {
              if(focused){
                return(<Icon name="pencil" type="MaterialCommunityIcons" size={13}/>)
              }else{
                return(<Icon name="pencil-outline" type="MaterialCommunityIcons" size={13}/>)}
              }
            }} />

        <Tab.Screen name="Chat" component={chatIndex} 
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused, color}) => {
              if(focused){
                return(<Icon name="chat" type="MaterialCommunityIcons" size={13}/>)
              }else{
                return(<Icon name="chat-outline" type="MaterialCommunityIcons" size={13}/>)}
              }
           }}/>

        <Tab.Screen name="MyPage" component={MyPage}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused, color}) => {
              if(focused){
                return(<Icon name="person" size={13}/>)
              }else{
                return(<Icon name="person-outline" size={13}/> )}
              }
            }} />
    </Tab.Navigator>
  );
}

export default TabScreen;