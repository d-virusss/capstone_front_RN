import AsyncStorage from '@react-native-community/async-storage';
import { firestore } from 'firebase';
import React, { Component, useState, useCallback, useEffect, Fragment } from 'react';
import {
  Platform, KeyboardAvodingView, SafeAreaView,
  StyleSheet, Alert, Image
} from 'react-native';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import Popover from 'react-native-popover-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GiftedChat} from 'react-native-gifted-chat';
import { Bubble, Time, Composer, Message} from 'react-native-gifted-chat'
import Fire from '../shared/Fire';
import api from '../shared/server_address';

let myID;
let token;
let myName;
let postID;
let other_nickname = '';
let postInfo = [];
let userID = 1;

function renderBubble (props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left:{
      
        },
        right: {
          backgroundColor: '#ff3377',
        }
      }}
      //textProps={{ style: {color: props.position === 'right' ? 'black': 'black', } }}
    />
  )
}

function renderTime(props) {
  return (
    <Time
    {...props}
      timeTextStyle={{
        left: {
          color:'#000',
        }
      }}
    />
  );
}

function renderComposer(props) {
  return <Composer {...props} placeholder={'메세지를 입력하세요'} />;
}

function renderMessage(props){
  return <Message
    {...props}
    containerStyle={{
      left:{
        padding:'1%'
      }
    }}
  />
}
//ChatRoom view function
function chat_room2 ({route, navigation}){
  const {chat_id, post_id, nickname, avatar} = route.params;
  const [show_popover, setShowPopover] = useState(false);
  const [post_title, setPostTitle] = useState('');
  const [post_img, setPostImg] = useState('');
  let [messages, setMessages] = useState([]);
  const getToken = async() => {
    token = await AsyncStorage.getItem('token');
  }

  const getPostInfo = async () => {
    await api
            .get(`posts/${postID}`,{
              headers:{
                'Authorization': token
              }
            })
            .then((response)=>{
              console.log(response)
              postInfo = response.data;
              setPostTitle(response.data.post_info.title);
              setPostImg(response.data.post_info.image);
            })
            .catch((err)=>console.log(err))
  }
  const getMyInfo = async()=>{
    myID = await AsyncStorage.getItem('user_id');
    Fire.getSenderID(myID);
    await api
            .get(`/users/${myID}`,{
              headers:{
                'Authorization': token
              }
            })
            .then((res)=>{
              myName = res.data.user_info.nickname
            })
            .catch(err=>console.log(err))
  }

  const onSend = useCallback((messages=[]) => {
    Fire.send(messages);
    //setMessages(previous=>GiftedChat.append(previous, messages))
  },[])

  useEffect(()=>{
    getToken();
    getMyInfo();
    getPostInfo();
    Fire.getChatID(chat_id);
    //메세지를 하나씩 뜯어내서 조립해야함 
    //센더와 내 아이디가 같다면?
    //하지만 여기서 firemessage는 이미 저장되어있는 정보를 한번에 가져옴
    //map에 실패함
    Fire.get(message=>{
      setMessages(previous=>GiftedChat.append(previous, message))
    })
  },[])

  
  const chat = <GiftedChat messages={messages}
    onSend={messages => onSend(messages)}
    user={{_id:1}}
    renderBubble={renderBubble}
    renderTime={renderTime}
    renderComposer={renderComposer}
    renderMessage={renderMessage}

  />
  if(Platform.os === 'android'){
    return(
      <KeyboardAvodingView style={{flex:1}}
        behavior="padding"
        keyboardVerticalOffset={30}
        enabled
      >
        <Container>
          <Header style = {{height : 45}}>
            <Left>
              <Button transparent onPress = {() => {navigation.goBack()}}>
                <Icon name = 'chevron-back'/>
              </Button>
            </Left>
            <Body>
              <Text style = {{fontSize : 17,}}>{other_nickname}</Text>
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
                      onPress={() => {setShowPopover(false); navigation.navigate('PostReport')}}>
                    <Text style={styles.popoverel}>신고하기</Text>
                  </TouchableOpacity>
                </Popover>
            </Right>
          </Header>
          <TouchableOpacity onPress ={()=>{navigation.navigate('PostShow',{post: postInfo})}}>
            <Header style = {{
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomColor: '#cccccc'
            }}>
              <Image source = {{uri: post_img || "https://applepink.s3.amazonaws.com/uploads/user/image/1/square_447087af-da95-4a04-94c4-2ccccc782c28applePink_logo.png"}} style={{
                width:50,
                height:50,
                margin: '3%'
              }}
              />
              <Text>
                {post_title}
              </Text>
              <Icon transparent style={{
                width:50,
                height:50,
              }}
              />
            </Header>
          </TouchableOpacity>
          {chat}
        </Container>
      </KeyboardAvodingView>
    );
  }
  return(
    <SafeAreaView style={{flex:1}}>
      <Container>
        <Header style = {{height : 45}}>
          <Left>
            <Button transparent onPress = {() => {navigation.goBack()}}>
              <Icon name = 'chevron-back'/>
            </Button>
          </Left>
          <Body>
            <Text style = {{fontSize : 17,}}>{other_nickname}</Text>
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
                    onPress={() => {setShowPopover(false); navigation.navigate('PostReport')}}>
                  <Text style={styles.popoverel}>신고하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {setShowPopover(false); messageGetRequest()}}>
                  <Text style={styles.popoverel}>새로고침</Text>
                </TouchableOpacity>
              </Popover>
          </Right>
        </Header>
        <TouchableOpacity onPress ={()=>{navigation.navigate('PostShow',{post: postInfo})}}>
          <Header style = {{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#cccccc'
          }}>
            <Image source = {{uri: post_img || "https://applepink.s3.amazonaws.com/uploads/user/image/1/square_447087af-da95-4a04-94c4-2ccccc782c28applePink_logo.png"}} style={{
              width:50,
              height:50,
              margin: '3%'
            }}
            />
            <Text>
              {post_title}
            </Text>
            <Icon transparent style={{
              width:50,
              height:50,
            }}
            />
          </Header>
        </TouchableOpacity>
          {chat}
      </Container>
    </SafeAreaView>
    );
  
}

const styles = StyleSheet.create({
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  
})

export default chat_room2;