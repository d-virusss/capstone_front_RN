import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';


const api = axios.create({baseURL: 'http://52.79.179.211'});
var token = 0;
var getMessageString;
var getFlag = 0;

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

  messageSet = () => {
    setMessages([
      {
        _id: 1,
        text: getMessageString,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }

  messageGetRequest = () => {
    api
      .get(`/chats/${chat_id}/messages`, null,{ headers : {
        'Authorization': token
      }})
      .then((response) => {
        console.log('success');
        console.log(response);
        if(response != null){
          useEffect(() => {
            setMessages([
              {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'React Native',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
            ])
          }, [])
        }
      })
      .catch((err) => console.log("err : ", err))
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

  useEffect(() => {
    setTimeout(messageGetRequest, 10000);
  });

  getToken();
  console.log('in1');
  if(getFlag === 1) setTimeout(messageGetRequest,3000);
  else messageGetRequest();
  console.log('in2');
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
  );
  
}

export default ChatRoom;