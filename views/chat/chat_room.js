import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useCallback, useEffect, Fragment } from 'react';
import {StyleSheet, Alert, Image} from 'react-native';
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
import { Bubble, Time, Composer, Avatar, Message} from 'react-native-gifted-chat'

IconM.loadFont();

let updateFlag = 0;
let chatID = 0;
let postID = 0;
let userName = "";
let token = AsyncStorage.getItem('token');
let myID = -1;
let other_id=-1;
let other_nickname = '';
let avatarURI='empty';
let postInfo = [];

function forTimeout(){
  return 1;
}

function forceUpdate(){
  const [value, setValue] = useState(0);
  return() => setValue(value => ++value);
}

function ChatRoom ({route , navigation}) {
  const [refreshing, setRefreshing] = useState();
  const [post_title, setPostTitle] = useState('');
  const [post_img, setPostImg] = useState('');

  const getToken = async () => {
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

  const {chat_id, post_id, nickname, avatar} = route.params;
  if(updateFlag === 0) {
    chatID = chat_id;
    postID = post_id;
    other_nickname = nickname;
    avatarURI = avatar;
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

  const [messages, setMessages] = useState([]);
  const [show_popover, setShowPopover] = useState(false);
  const onSend = useCallback(async(messages = []) => {
    console.log(messages[0].text);
    let dbData = [];
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
        console.log(response)
        dbData = response.data
        console.log('going out')
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
        Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
      });
    console.log(messages[0]);
    (await db).transaction((tx)=>{
      tx.executeSql('insert into message (message_id, chat_id, sender_id, message_text, message_created, image_url) VALUES(?,?,?,?,?,?)',
      [dbData.message_info.id, chatID, myID,dbData.message_info.body,dbData.message_info.created_time,dbData.message_info.sender.image],
      (tx,results)=>{console.log(results.rowsAffected)},(err)=>{console.log(err)})
    })
    function mSetting(){
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }
    setTimeout(mSetting, 50)
  }, [])
  const onGet = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  },[])
  

  const messageGetRequest = async () => {
    console.log(token);
    console.log(myID);
    console.log(chatID);
    console.log("avatar  "+avatarURI)
    await api
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
          console.log(response)
          let chatDataList= [];
          if(response.data.length>0) updateFlag = 1;
          let len = response.data.length
          for(let i = len-1; i>=0; i--){
            loadMessage = response.data[i]
            let gotChatData = 
            {
              _id: null,
              createdAt: null,
              text: null,
              image:'',
              user:{
                _id: 2,
                name: userName,
                avatar: avatarURI,
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
            db.transaction((tx)=>{
              console.log('in get transaction')
              tx.executeSql('INSERT INTO message (message_id, chat_id, sender_id, message_text, message_created, image_url) VALUES(?,?,?,?,?,?)',
              [gotChatData._id,chatID,loadMessage.message_info.sender.id,gotChatData.text,gotChatData.createdAt,gotChatData.image],(tx, results)=>{
                console.log('Results : ', results.rowsAffected)
              },(error)=>{
                console.log("dbdbdb error ", error)
              })
            })
          }
          console.log(response)
          if(response.data.length > 0) {
            updateFlag=1;
            onGet(chatDataList);
          }
        }
      })
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  const getOldChat = async() => {
    console.log('in old chat')
    console.log(avatarURI);
    db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM message WHERE chat_id=?',[chatID],(tx, results)=>{
        let len = results.rows.length;
        console.log('length'+len)
        console.log(results.rows.item(0))
        if(len>0){
          let chatDataList = [];
          for(let i = len-1; i>=0; i--){
            let loadMessage = results.rows.item(i)
            let sender = 0;
            let avatarImage = '';
            console.log(loadMessage.sender_id)
            if(loadMessage.sender_id == myID) {
              sender = 1;
            }
            else {
              other_id = loadMessage.sender_id;
              avatarImage=avatarURI;
              sender = 2;
            }
            let gotChatData = 
            {
              _id: null,
              createdAt: null,
              text: null,
              user:{
                _id: sender,
                name: userName,
                avatar: avatarImage,
              }
            }
            console.log(gotChatData)
            gotChatData._id = loadMessage.message_id;
            gotChatData.createdAt = loadMessage.message_created;
            gotChatData.text = loadMessage.message_text;
            console.log("----------------------");
            console.log(gotChatData.text);
            chatDataList[chatDataList.length] = gotChatData;
          }
          updateFlag = 1;
          setTimeout(forTimeout, 50);
          onGet(chatDataList);
        }
      })
    })
  }
  /*db.transaction((tx)=>{
    tx.executeSql('drop table message',
    (tx,results)=>console.log('create execute'),
    (error)=>console.log(error));
  })*/
  db.transaction((tx)=>{
    tx.executeSql('create table if not exists message (message_id integer primary key, chat_id integer, sender_id integer, message_text text, message_created text, image_url text)',[],
    (tx,results)=>console.log('create execute'),
    (error)=>console.log(error));
  })
  useEffect(()=>{
    getToken();
    setTimeout(10, getPostInfo);
    const unsubscribe = navigation.addListener('focus', ()=>{
      updateFlag = 0;
    })
  })
  const update = forceUpdate();
  if(updateFlag === 1){
    //setTimeout(update, 100000);
  }
  else {
    updateFlag = 1;
    setTimeout(messageGetRequest, 50)
    setTimeout(getOldChat, 100);
    setTimeout(update, 200);
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
      <GiftedChat
        renderAvatarOnTop = {true}
        showAvatarForEveryMessage = {true}
        renderTime={renderTime}
        renderBubble = {renderBubble}
        renderComposer = {renderComposer}
        renderMessage = {renderMessage}
        messages={messages}
        onSend={messages => onSend(messages)}
        onPressAvatar={()=> navigation.navigate('ProfileShow',{other_id : other_id})}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
  
}
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

const styles = StyleSheet.create({
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  
})

export default ChatRoom;