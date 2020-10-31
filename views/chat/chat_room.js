import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect, Fragment } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';

var updateFlag = 0;

const api = axios.create({ baseURL: 'http://3.35.9.144'});
let token = 0;

function forceUpdate(){
  const [value, setValue] = useState(0);
  return() => setValue(value => ++value);
}

function ChatRoom ({route , navigation}) {
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

  const {chat_id} = route.params;
  const [messages, setMessages] = useState([]);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    console.log(messages[0].text);
    api
      .post(`/chats/${chat_id}/messages`, 
        {
          message : {
            body : messages[0].text,
            images_attributes : null
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
  const onGet = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  },[])

  const messageGetRequest = () => {
    console.log(token);
    api
      .get(`/chats/${chat_id}/messages`, 
      { 
        headers : {
          'Authorization' : token
        }
      }
      )
      .then((response) => {
        console.log('success');
        console.log(response);
        if(response != null){
          let chatDataList= [];
          if(response.data.length>0) updateFlag = 1;
          response.data.map(async (loadMessage) => {
            let gotChatData = 
            {
              _id: null,
              createdAt: null,
              text: null,
              user:{
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              }
            }
            gotChatData._id = loadMessage.message_info.id;
            gotChatData.createdAt = loadMessage.message_info.created_time;
            gotChatData.text = loadMessage.message_info.body;
            console.log("----------------------");
            console.log(gotChatData.text);
            chatDataList[chatDataList.length] = gotChatData;
            console.log(JSON.stringify(chatDataList));
          })
          console.log(JSON.stringify(chatDataList));
          if(response.data.length > 0) onGet(chatDataList);
        }
      })
      .catch((err) => console.log("err : ", err))
  }

  getToken();
  messageGetRequest();
  const update = forceUpdate();
  if(updateFlag === 0)
    setTimeout(update, 2000);
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
        <Right>
          <Button onPress = {() => messageGetRequest()}></Button>
        </Right>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
  
}

export default ChatRoom;