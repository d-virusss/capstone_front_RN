import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const api = axios.create({baseURL: 'http://52.79.179.211'});
var token = 0;
var syncflag = 0;

getToken = async () => {
  try{
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      token = value;
      syncflag = 1;
    }
    console.log(token);
  } catch (error){
    console.log("error : ", error);
  }
}

function ChatRoom({route, navigation}) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([
      /* is an example{
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      }, */
      //calling for messages callback
      //chat create 소비자가 채팅 거래하기 버튼을 눌러쓸 시에 postshow user id 1,2
      //chat index 여태까지 채팅 정보 목록
      //message index 채팅방에서 안에서 목록
      //message create onsend message create
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    console.log(messages[0].text);
    api
      .post(`/chats/${2}/messages`, 
        {
          body : {
            body : messages[0].text,
            images_attributes : { 0 : {}}
          }
        },
        {
          headers : {
            'Authorization' : token
          }
        }
      )
      .then((response) => {
        console.log("create success!")
        console.log(response)
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
      });
  }, [])
  getToken();
  //console.log(postId);
  return (
    <Container>
      <Header style = {{height : 56}}>
        <Left>
          <Button transparent onPress = {() => navigation.goBack()}>
            <Icon name = 'arrow-back'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 17}}>채팅</Text>
        </Body>
        <Right></Right>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  )
}

export default ChatRoom;