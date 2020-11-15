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

IconM.loadFont();

let updateFlag = 0;
let chatID = 0;
let postID = 0;
let userName = "";
let token = 0;

function forceUpdate(){
  const [value, setValue] = useState(0);
  return() => setValue(value => ++value);
}

function ChatRoom ({route , navigation}) {
  const [refreshing, setRefreshing] = useState();

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

  const {chat_id, post_id} = route.params;
  if(updateFlag === 0) {
    chatID = chat_id;
    postID = post_id;
  }
  const [messages, setMessages] = useState([]);
  const [show_popover, setShowPopover] = useState(false);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    console.log(messages[0].text);
    api
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
                name: userName,
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

  getUserInfo = async () => {
    await api 
            .get(`/posts/${postID}`,{
              headers : {
                'Authorization' : token
              }
            })
            .then((response)=>{
              userName = response.data.user.user_info.nickname;
              console.log(response.data)
            })
            .catch((error)=>console.log(error))
  }

  getToken();
  getUserInfo();
  messageGetRequest();
  const update = forceUpdate();
  if(updateFlag === 1){
    console.log(updateFlag)
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
  container : {
    paddingBottom : 50,
  },
  imageArea : {
    width: '95%',
    height : '50%',
    justifyContent : 'center',
    alignItems : 'center',
    alignSelf : 'center'
  },
  providerBar : {
    flexDirection : "row",
    borderBottomWidth : 0,
    paddingVertical: '3%'
  },
  providerProfileiimage :{
    width : 50,
    height : 50,
    borderRadius : 10,
    marginLeft: '3%',
  },
  providerProfile : {
    width: '30%',
    marginLeft : '3%'
  },
  providerName : {
    fontSize : 20,
    fontWeight : "bold",
    padding : '5%'
  },
  providerLocation : {
    fontSize : 13,
    color : 'grey',
    padding : '5%'
  },
  fontView : {
    fontSize : 17,
    margin : '5%'
  },
  imageView : {
    width: '90%',
    height: 300,
    marginVertical: '10%',
  },
  likeIcon : {
    color : 'red',
    fontSize : 25
  },
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