import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect, Fragment } from 'react';
import {StyleSheet, Alert} from 'react-native';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Popover from 'react-native-popover-view';
import api from '../shared/server_address';
import db from '../shared/chat_db';

IconM.loadFont();

let updateFlag = 0;
let chatID = 0;
let postID = 0;
let userName = "";
let token = 0;
let myID = -1;

function forTimeout(){
  return 1;
}

function forceUpdate(){
  const [value, setValue] = useState(0);
  return() => setValue(value => ++value);
}

function ChatRoom ({route , navigation}) {
  getToken = async () => {
    try{
      const value = await AsyncStorage.getItem('token');
      myID = await AsyncStorage.getItem('user_id');
      if (value !== null) {
        token = value;
        syncflag = 1;
      }
      console.log(token);
    } catch (error){
      console.log("error : ", error);
    }
  }

  const {chat_id, post_id} = route.params;
  if(updateFlag === 0) {
    chatID = chat_id;
    postID = post_id;
  }
  const [messages, setMessages] = useState([]);
  const [show_popover, setShowPopover] = useState(false);
  const onSend = useCallback(async(messages = []) => {
    console.log(messages[0].text);
    await api
      .post(`/chats/${chatID}/messages`, 
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
        console.log(response.status)
        db.transaction((tx)=>{
          console.log('in insert ')
          tx.executeSql('INSERT INTO message (message_id, chat_id, sender_id, message_text, message_created, image_url) VALUES(?,?,?,?,?,?)',
          [response.data.message_info.id,chatID,myID,messages[0].text, messages[0].createdAt,messages[0].image],(tx, results)=>{
            console.log('Results onsend '+ results.rowsAffected)
          }),(error)=>{
            console.log('onsend dbdbdb error '+ error)
          }
        })
        console.log('going out')
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
      });
    console.log('end of post')
    setTimeout(forTimeout,1000)
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
  const onGet = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  },[])

  const messageGetRequest = async () => {
    console.log(token);
    console.log(chatID);
    api
      .get(`/chats/${chatID}/messages`, 
      { 
        headers : {
          'Authorization' : token
        }
      }
      )
      .then((response) => {
        console.log('get success');
        console.log(response.status);
        if(response != null){
          let chatDataList= [];
          if(response.data.length>0) updateFlag = 1;
          response.data.map(async (loadMessage) => {
            let gotChatData = 
            {
              _id: null,
              createdAt: null,
              text: null,
              image:'',
              user:{
                _id: 2,
                name: userName,
                avatar: 'https://placeimg.com/140/140/any',
              }
            }
            gotChatData._id = loadMessage.message_info.id;
            gotChatData.createdAt = loadMessage.message_info.created_time;
            gotChatData.text = loadMessage.message_info.body;
            gotChatData.image = loadMessage.message_info.image;
            console.log("----------------------");
            console.log(gotChatData.text);
            chatDataList[chatDataList.length] = gotChatData;
            console.log(JSON.stringify(chatDataList));
            (await db).transaction((tx)=>{
              console.log('in get transaction')
              tx.executeSql('INSERT INTO message (message_id, chat_id, sender_id, message_text, message_created, image_url) VALUES(?,?,?,?,?,?)',
              [gotChatData._id,chatID,-1,gotChatData.text,gotChatData.createdAt,gotChatData.image],(tx, results)=>{
                console.log('Results : ', results.rowsAffected)
              }),(error)=>{
                console.log("dbdbdb error ", error)
              }
            })
          })
          console.log(JSON.stringify(chatDataList));
          if(response.data.length > 0) onGet(chatDataList);
        }
      })
      .catch((err) => console.log("err : ", err))
  }

  getOldChat = async() => {
    console.log('in old chat')
    (await db).transaction((tx)=>{
      tx.executeSql('SELECT * FROM message WHERE chat_id=?',[chatID],(tx, results)=>{
        let len = results.rows.length;
        if(len>0){
          let chatDataList = [];
          for(let i = 0; i<len; i++){
            let loadMessage = results.rows.item(i)
            let sender = 0;
            if(loadMessage.sender_id === myID) sender = 1;
            else sender = 2;
            let gotChatData = 
            {
              _id: null,
              createdAt: null,
              text: null,
              user:{
                _id: sender,
                name: userName,
                avatar: 'https://placeimg.com/140/140/any',
              }
            }
            gotChatData._id = loadMessage.id;
            gotChatData.createdAt = loadMessage.message_created;
            gotChatData.text = loadMessage.text;
            console.log("----------------------");
            console.log(gotChatData.text);
            chatDataList[chatDataList.length] = gotChatData;
            console.log(JSON.stringify(chatDataList));
          }
          onGet(chatDataList);
        }
      })
    })
  }
  db.transaction((tx)=>{
    tx.executeSql('create table if not exists message (message_id integer primary key, chat_id integer, sender_id integer, message_text text, message_created text, image_url text)',[],
    (tx,results)=>console.log(results),
    (error)=>console.log(error));
  })
  getToken();
  messageGetRequest();
  getOldChat();
  const update = forceUpdate();
  if(updateFlag === 1){
    //setTimeout(update, 100000);
  }
  else {
    updateFlag = 1;
    setTimeout(update, 100);
  }
  return (
    <Container>
      <Header style = {{height : 45}}>
        <Left>
          <Button transparent onPress = {() => {updateFlag = 0; navigation.goBack()}}>
            <Icon name = 'chevron-back'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 17}}>채팅</Text>
        </Body>
        <Right>
        <Popover
              isVisible = {show_popover}
              onRequestClose = {() => setShowPopover(false)}
              from={(
                <TouchableOpacity onPress={() => setShowPopover(true)}>
                  <Icon name="menu" />
                </TouchableOpacity>
              )}>
              <TouchableOpacity
                  onPress={() => {setShowPopover(false); updateFlag = 0; navigation.navigate('PostReport')}}>
                <Text style={styles.popoverel}>신고하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {setShowPopover(false); Alert.alert("신고하지마요 ㅜ")}}>
                <Text style={styles.popoverel}>가짜신고하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert("집에가고 싶나?")}>
                <Text style={styles.popoverel}>힘들 떄</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert("히히 못가")}>
                <Text style={styles.popoverel}>집가기</Text>
              </TouchableOpacity>
            </Popover>
        </Right>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        onPressAvatar={()=> navigation.navigate('ProfileShow')}
        user={{
          _id: 1,
        }}
      />
      <Button onPress= {()=>{update()}}>
        <Text>수동 업데이트</Text>
      </Button>
    </Container>
  );
  
}

const styles = StyleSheet.create({
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  postbody: {
    paddingVertical : '7%',
    paddingHorizontal : '5%',
    flexDirection: 'column',
    alignItems : 'flex-start'
  },
  post_title :{
    fontSize : 25,
    fontWeight : "bold",
    paddingVertical : '3%'
  },
  post_category :{
    fontSize: 15,
    color: 'grey',
  },
  post_body : {
    marginTop : '10%'
  }
})

export default ChatRoom;