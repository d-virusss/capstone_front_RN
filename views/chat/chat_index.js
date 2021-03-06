import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useEffect } from 'react';
import {ActionSheetIOS, RefreshControl, ScrollView,} from 'react-native';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text,
  Title,
  Badge
} from 'native-base';
import {TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native-animatable';
import _ from 'lodash';

IconM.loadFont();

let BUTTONS = ["물품 등록", "대여요청하기", "취소"];
let CANCEL_INDEX = 2;

let token;
let refreshFlag = true;
let noChat = false;

class ListProfile extends Component {  
  state = {
    nick: "",
  }
  getImage= async() => {
    await api
            .get(`posts/${postID}`,{
              headers:{
                'Authorization': token
              }
            })
            .then((response)=>{
              console.log(response)
              this.state.img = response.data.post_info.image;
            })
            .catch((err)=>console.log(err))
  }
  render(){
    return(
      <TouchableOpacity style = {{paddingBottom:14}} onPress = {() => this.props.navigation.navigate('ChatRoom', {chat_id : this.props.chatID, post_id: this.props.postID, nickname:this.props.nickname, avatar:this.props.imgURI, other_id:this.props.other_user})}>
      <ListItem avatar noBorder style={{
        borderColor:'#cccccc'
      }}>
        <Left>
          {this.props.imgURI &&
            <Thumbnail source={(this.props.imgURI == "/image/default.png" ? require("../../assets/default.png") : { uri: this.props.imgURI })} style={{ width: 60, height: 60, }} />
          }
          {!this.props.imgURI && 
            <Thumbnail source={( require("../../assets/default.png") )} style={{ width: 60, height: 60, }} />
          }
          
        </Left>
        <Body style={{paddingVertical: 30, alignSelf: 'center'}} >
          
            <Text> {this.props.nickname} </Text>
            <Text note> {this.props.body} </Text>
          
        </Body>
        <Right style={{ flexDirection:'row', alignItems : 'center', justifyContent : 'flex-end', paddingVertical: 0}}>
          {this.props.exist_unchecked ? 
            <Badge small style={{}}><Text>{this.props.unchecked}</Text></Badge>
            : <Text></Text> }
            <Text note style={{ marginLeft : '5%' }}> {this.props.time}</Text>
        </Right>
      </ListItem>
      </TouchableOpacity>
    );
  }
}

function ChatList ({ navigation, getTotalChat }){
  
  console.log("enter chatlist -----------------")
  const [chats, setChats] = useState([]);
  const [refreshing, setRefresh] = useState();
  const [unchecked, setUnchecked] = useState();
  let imgURI = '';
  const _onRefresh = () => {
   
    console.log("refresh")
    
    setRefresh(true);
    chatGetRequest();
    getTotalChat();
    setRefresh(false);
  }
  
  const getToken = async () => {
    try{
        const value = await AsyncStorage.getItem('token');
        if (value !== null) token = value;
    } catch (error){
      console.log("error : ", error);
    }
    console.log(token);
  }
  
  const chatGetRequest = async () => {
    await api
      .get(`/chats`, 
      { 
        headers : {
          'Authorization': token,
        }
      })
      .then((response) => {
        console.log(response)
        let total_unchecked = 0;
        _.each(response.data, (chat) => {
          total_unchecked += chat.chat_info.num_unchecked;
        })
        setUnchecked(total_unchecked)
        
        console.log(JSON.stringify(response.data)+ " response data");
        if(JSON.stringify(response.data) === '[]') {
          console.log("111111111111111");
          noChat = true;
        }
        else{
          noChat = false
        }
        console.log(noChat+" nochat")
        setChats(response.data, [])
      })
      .catch((err) => {
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  let callimage = () => {
    console.log(avatar)
  }

  const makeIndexList = () => {
    console.log(chats);
    return chats.map((chat) => {
      return(
        <ListProfile navigation = {navigation}
          nickname = {chat.chat_info.nickname} 
          postID = {chat.chat_info.post_id} 
          body = {chat.chat_info.message} 
          time = {chat.chat_info.created_time} 
          chatID = {chat.chat_info.id}
          unchecked = { chat.chat_info.num_unchecked }
          exist_unchecked = {chat.chat_info.num_unchecked > 0 && true}
          imgURI = {chat.chat_info.image}
          key = {chat.chat_info.id}
          other_user={chat.chat_info.other_users[0]}
        /> 
      )
    })
  }

  useEffect(() => {
    async function inEffect(){
      await getToken()
      await chatGetRequest();
      console.log("--------------------")
    }
    inEffect();
    const unsubscribe = navigation.addListener('focus', () => {
      chatGetRequest();
      getTotalChat();
    });

    return unsubscribe;
  },[navigation])
  return(
    <Container>
    <Header style={{height: 60,
    backgroundColor: '#f8f8f8',}}
    androidStatusBarColor='black'
    >
      <Body>
        <Title style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>채팅</Title>
      </Body>
    </Header>
        <ScrollView  
        refreshControl={
        <RefreshControl refreshing={refreshing}
        onRefresh={_onRefresh}/>}>
          <List>
            {noChat == true && 
              <View style = {{justifyContent : "center", alignItems: 'center', height : 500}}>
                <Text>채팅이 없습니다.</Text>
              </View>
            }
            {noChat == false && makeIndexList()}
          </List>
        </ScrollView>
      </Container>
  );
}
export default ChatList;