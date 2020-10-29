import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect, Fragment } from 'react';
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

class ChatRoomC extends Component{
  componentDidMount(){

  }
  render(){
    return(
      <Fragment></Fragment>
    );
  }
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
  const [val, setVal] = useState(0);
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

          var num;
          //num = response.data.message_info.length
          num = response.data.length;
          console.log(num);
          var tempGiftedMessage = {
            _id: 1,
            text: '',
            createdAt: '',
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
            },
          }
          for(var i = 0; i<num; i++){
            let temp = {
              message_info : {
                id : '',
                created_time :'',
                chat_id : '',
                body: '',
                sender : '',
              }
            }
            temp = response.data[i];
            console.log(JSON.stringify(temp));
            console.log(temp.message_info.body);
            tempGiftedMessage._id = temp.message_info.id;
            console.log(tempGiftedMessage._id);
            tempGiftedMessage.text = temp.message_info.body;
            tempGiftedMessage.createdAt = temp.message_info.created_time;
            setMessages(previousMessages => GiftedChat.append(previousMessages, tempGiftedMessage));
            
          }
        }
      })
      .catch((err) => console.log("err : ", err))
  }

  getToken();
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
      <ChatRoomC/>
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