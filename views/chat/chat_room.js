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
let token='';
let postInfo;

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
      },
      right:{
        padding:'1%'
      }
    }}
  />
}
//ChatRoom view function
function chat_room ({route, navigation}){
  const {chat_id, post_id, nickname, avatar, other_id} = route.params;
  const [show_popover, setShowPopover] = useState(false);
  const [post_title, setPostTitle] = useState('');
  const [post_img, setPostImg] = useState('');
  let [messages, setMessages] = useState([]);
  const getToken = async() => {
    token = await AsyncStorage.getItem('token');
  }

  const getPostInfo = () => {
    api
      .get(`posts/${post_id}`,{
        headers:{
          'Authorization': token
        }
      })
      .then((response)=>{
        postInfo = response.data;
        console.log(postInfo);
        //avatar=response.data.user.user_info.image;
        setPostTitle(response.data.post_info.title);
        setPostImg(response.data.post_info.image);
      })
      .catch((err)=>console.log(err))
  }
  const getMyInfo = async()=>{
    myID = await AsyncStorage.getItem('user_id');
    Fire.getSenderID(myID);
    api
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

  const messageGetRequest = () => {
    Fire.getAvatar(avatar);
    console.log(chat_id);
    api
      .get(`/chats/${chat_id}/messages`, 
      { 
        headers : {
          'Authorization' : token
        }
      }
      )
      .then((response) => {
        console.log('get success');
        console.log(response.status);
      })
      .catch((err) => {
        console.log("err : ", err)
        //Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  const onSend = useCallback(async(messages=[]) => {
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
        Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
      });
    console.log(messages[0]);
    Fire.send(messages);
  },[])

  const exit_request = () => {
    console.log(`${chat_id}`)
    api
      .delete(`/chats/${chat_id}`, {
        headers: {
          'Authorization': token
        },
      })
      .then((res) => {
        console.log(res)
        console.log("send res!")
        navigation.goBack()
      })
      .catch((err) => {
        console.log(err.data)
        console.log("send failed")
        navigation.goBack()
      })
  }

  useEffect(()=>{
    async function inEffect(){
      await getToken();
      await getMyInfo();
      getPostInfo();
      messageGetRequest();
      console.log("chat room params")
      console.log(route.params)
      Fire.getChatID(chat_id);
      Fire.get(message=>{
        console.log(message)
        setMessages(previous=>GiftedChat.append(previous, message))
      })
    }
    inEffect();
  },[])

  
  const chat = <GiftedChat messages={messages}
    renderAvatarOnTop = {true}
    showAvatarForEveryMessage = {true}
    onSend={messages => onSend(messages)}
    user={{_id:1}}
    renderBubble={renderBubble}
    renderTime={renderTime}
    renderComposer={renderComposer}
    renderMessage={renderMessage}
    onPressAvatar={()=> {
        console.log("상대방id: "+other_id)
        if(other_id != undefined){
          navigation.navigate('ProfileShow',{user_id : other_id})
        }
        else if(other_id == undefined){
          Alert.alert("모두나눔", "없는 유저입니다.", [
            { text: '확인', style: 'cancel' }])
        }
      }}
  />
  if(Platform.os === 'android'){
    return(
      <KeyboardAvodingView style={{flex:1}}
        behavior="padding"
        keyboardVerticalOffset={30}
        enabled
      >
        <Container>
        <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
            justifyContent:'space-between'}}
            androidStatusBarColor='#000'
        >
            <Left>
              <Button transparent onPress = {() => {navigation.goBack()}}>
                <Icon name = 'chevron-back'/>
              </Button>
            </Left>
            <Body>
              <Text style = {{fontSize : 17,}}>{nickname}</Text>
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
                    onPress={() => {setShowPopover(false); navigation.navigate('PostReport',{onGoBack: () => {getPostInfo(); }, post: postInfo})}}>
                  <Text style={styles.popoverel}>신고하기</Text>
                </TouchableOpacity>
              </Popover>
            </Right>
          </Header>
          <TouchableOpacity onPress ={()=>{navigation.navigate('PostShow',{post_id: post_id})}}>
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
      <Container>
        <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
            justifyContent:'space-between'}}
            androidStatusBarColor='#000'
        >
          <Left>
            <Button dark transparent onPress = {() => {navigation.goBack()}} style={{paddingVertical : 10,
              paddingHorizontal : 15,
              margin : 5,}}
            >
              <Icon name = 'chevron-back' color='black'/>
            </Button>
          </Left>
          <Body>
            <Text style={{fontSize: 17, color: 'black', alignSelf: 'center'}}>{nickname}</Text>
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
                  onPress={() => {setShowPopover(false); navigation.navigate('PostReport',{onGoBack: () => {getPostInfo(); }, post: postInfo})}}>
                <Text style={styles.popoverel}>신고하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowPopover(false); exit_request(); }}>
                <Text style={styles.popoverel}>채팅방 나가기</Text>
              </TouchableOpacity>
            </Popover>
          </Right>
        </Header>
        <TouchableOpacity onPress ={()=>{navigation.navigate('PostShow',{post_id: post_id})}}>
          <Header style = {{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#cccccc'
          }} androidStatusBarColor='#000'>
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
    );
  
}

const styles = StyleSheet.create({
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  
})

export default chat_room;