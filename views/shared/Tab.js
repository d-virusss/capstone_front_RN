import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {StyleSheet, Alert} from 'react-native';
import React, { Component, ReactElement } from 'react';
import {Icon, Text, Badge} from 'native-base'
import MyPage from '../mypage/lobby';
import PostIndex from '../post/index'
import ChatIndex from '../chat/chat_index';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import TouchableOpacity from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address'
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

IconM.loadFont();

const Tab = createBottomTabNavigator();
var total_unchecked = 0;
let token = '';
var chats = []

class TabScreen extends Component {

  state = {
    loading : true,
  }

  getTotalChat = async () => {
    total_unchecked = 0
    console.log('chat index request ---------------')
    token = await AsyncStorage.getItem('token');
    await api
      .get(`/chats`, 
      { 
        headers : {
          'Authorization': token,
        }
      })
      .then((response) => {
        console.log('chat index request done --------------------')
        chats = response.data
        console.log(chats)
        _.each(chats, (chat) => {
          total_unchecked += chat.chat_info.num_unchecked;
        })
        this.setState({loading : false})
      })
      .catch(function(e) {
        Alert.alert("접근 실패", "로그인 정보를 확인해주세요.",
          [
            {
            text:'확인', 
            onPress : () => this.props.navigation.navigate("Logins")
            }, 
            {
              style:'cancel'
            }
          ]
        )
      }.bind(this));
  
  }

  componentDidMount() {
    this.getTotalChat();
  }
  
  
  render(){
    if(this.state.loading) return null;
    else{
      console.log(this.state.loading)
      return (
        <Tab.Navigator tabBarOptions={{ 
          activeTintColor : "black", labelStyle:{ fontSize: 13,  },
          iconStyle: { height: 25 }, tabStyle: { paddingTop: '1%', backgroundColor:'##F8F8F8'}
        }}>
          <Tab.Screen name="Home" component={PostIndex}
            options={{
              tabBarLabel:"홈",
              tabBarIcon: ({focused, color}) => {
                if(focused){
                  return(<Icon name="home" size={11} style={{}}/>)
                }else{
                  return(<Icon name="home-outline" size={11}/>)}
                }
              }}/>
    
    
          <Tab.Screen name="Chat" children={()=><ChatIndex navigation={this.props.navigation} chat_data={chats} getTotalChat={this.getTotalChat}/>}
            options={{
              tabBarLabel:"채팅",
              tabBarIcon: ({focused, color}) => {
                if(focused){
                  return (<Icon name="chat" type="MaterialCommunityIcons" size={11} style={{}}/>)
                }else{
                  return(<Icon name="chat-outline" type="MaterialCommunityIcons" size={11}/>)}
                },
              tabBarBadge: total_unchecked === 0 ? null : total_unchecked,
              }}/>
            
    
          <Tab.Screen name="MyPage" component={MyPage}
            options={{
              tabBarLabel:"마이페이지",
              tabBarIcon: ({focused, color}) => {
                if(focused){
                  return(<Icon name="person" size={11} style={{}}/>)
              1}else{
                  return(<Icon name="person-outline" size={11}/> )}
                }
              }} />
        </Tab.Navigator>
      );
    }
  }
}

const styles = StyleSheet.create({
  returnbutton : {
    fontSize : 13,
    fontWeight : '400',
    color : 'black'
  }
});

export default TabScreen;