import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useEffect } from 'react';
import {ActionSheetIOS} from 'react-native';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text,
  Footer, FooterTab, Root, Button, Icon,
  Badge
} from 'native-base';
import BottomTab from '../shared/bottom_tab';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
IconM.loadFont();

let BUTTONS = ["물품 등록", "대여요청하기", "취소"];
let CANCEL_INDEX = 2;

let token;
let refreshFlag = true;

class ListProfile extends Component {  
  state = {
    nick: "",
  }
  render(){
    return(
      <ListItem avatar>
        <Left>
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom'), {chat_id : this.props.chatID, post_id: this.props.postID}}>
            <Thumbnail source={{ uri: this.props.imageURI}} style={{ marginTop: -14 }} />
          </TouchableOpacity>
        </Left>
        <Body style={{paddingVertical: 30}} >
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom', {chat_id : this.props.chatID, post_id: this.props.postID})}>
            <Text> {this.props.nickname} </Text>
            <Text note> {this.props.body} </Text>
          </TouchableOpacity>
        </Body>
        <Right>
          <Text note> {this.props.time} </Text>
        </Right>
      </ListItem>
    );
  }
}
function ChatList ({ navigation}){
  const [chats, setChats] = useState([]);

  const getToken = async () => {
    try{
        const value = await AsyncStorage.getItem('token');
        if (value !== null) token = value;
      } catch (error){
        console.log("error : ", error);
      }
      console.log(token);
    }
  
  const chatGetRequest = async() => {
    await api
      .get(`/chats`, 
      { 
        headers : {
          'Authorization': token
        }
      })
      .then((response) => {
        console.log('success');
        console.log(response);
        setChats(response.data, [])
      })
      .catch((err) => console.log("err : ", err))
  }

  let callimage = () => {
    console.log(avatar)
  }

  const makeIndexList = () => {
    console.log(JSON.stringify(chats));
    return chats.map((chat) => {
      return(
        <ListProfile navigation = {navigation} imageURI="https://picsum.photos/id/3/150/150" nickname = {chat.chat_info.nickname} postID = {chat.chat_info.post_id} body = {chat.chat_info.message} time = "" chatID = {chat.chat_info.id}/> 
      )
    })
  }

  useEffect(() => {
    getToken()
    if(refreshFlag){
      console.log(refreshFlag);
      refreshFlag = false;
      setTimeout(chatGetRequest, 200);
    }
    setTimeout(chatGetRequest,10000)
    console.log("--------------------")
  })
  return(
    <Container>
        <Content>
          <List>
            {makeIndexList()}
          </List>
        </Content>
        <Footer>
        <FooterTab>
          <Button vertical onPress={() => {navigation.navigate('postIndex'); refreshFlag = true;}}>
            <Icon name="home" />
            <Text>홈</Text>
          </Button>
          <Root vertical transparent>
            <Button
              transparent
              vertical
              style={{ alignSelf: 'center' }}
              onPress={() =>
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "글쓰기"
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                      refreshFlag = true;
                      navigation.navigate('P_W_p');
                    }
                    if (buttonIndex === 1) {
                      refreshFlag = true;
                      navigation.navigate('P_W_c');
                    }
                  },
                )}
            >
              <Icon name="pencil" style={{ color: '#6b6b6b' }} />
              <Text style={{ fontSize: 14, color: '#6b6b6b' }}>글쓰기</Text>
            </Button>
          </Root>
          <Button badge vertical onPress={() => {
            this.props.navigation.navigate('Chats')
          }
          }>
            <Badge ><Text>51</Text></Badge>
            <Icon name="chatbubble" />
            <Text>채팅</Text>
          </Button>
          <Button vertical onPress={() => {navigation.navigate('MyPage'); refreshFlag = true;}}>
            <Icon name="person" />
            <Text>마이페이지</Text>
          </Button>
        </FooterTab>
      </Footer>
      </Container>
  );
}
export default ChatList;