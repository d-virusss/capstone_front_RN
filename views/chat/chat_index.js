import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet} from 'native-base';

var BUTTONS = ["제공 글쓰기", "대여요청 글쓰기", "취소"];
var CANCEL_INDEX = 2;

import FootTab from '../shared/bottom_tab'

class ListAvatarExample extends Component {

  callimage = () => {
    console.log(avatar)
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List>
            <ListProfile imageURI="https://picsum.photos/id/3/150/150" title="시스템프로그래밍" body="과제 너무 어렵지만 즐겁다 ㅎㅎ" time="9:02 pm"></ListProfile>
            <ListProfile imageURI="https://picsum.photos/id/100/150/150" title="캡디" body="아 리액트 ㅡㅡ" time="8:55 pm"></ListProfile>
            <ListProfile imageURI="https://picsum.photos/id/1001/150/150" title="엄마" body="밥 먹었어?" time="8:49 pm"></ListProfile>
          </List>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.props.navigation.navigate('PLScreen')}>
              <Icon name="home"/>
              <Text>홈</Text>
            </Button>
            <Root vertical transparent>
              <Button 
                transparent
                vertical 
                style = {{alignSelf : 'center'}}
                onPress = {() =>
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "글쓰기"
                  },
                  buttonIndex => {
                    if(buttonIndex === 0) {
                      this.props.navigation.navigate('P_W_p');
                    }
                    if(buttonIndex === 1) {
                      this.props.navigation.navigate('P_W_c');
                    }
                  },
                )}
              >
                <Icon name="pencil" style = {{color : '#6b6b6b'}}/>
                <Text style = {{fontSize : 14, color : '#6b6b6b'}}>글쓰기</Text>
              </Button>
            </Root>
            <Button badge vertical onPress = {() => {
              this.props.navigation.navigate('Chats')}
            }>
              <Badge ><Text>51</Text></Badge>
              <Icon name="chatbubble" />
              <Text>채팅</Text>
            </Button>
            <Button vertical onPress = {() => this.props.navigation.navigate('Logins')}>
              <Icon name="person" />
              <Text>Mypage</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

class ListProfile extends Component {  
  render(){
    return(
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: this.props.imageURI}} style={{ marginTop: -14 }} />
        </Left>
        <Body style={{paddingVertical: 30}} >
          <Text> {this.props.title} </Text>
          <Text note> {this.props.body} </Text>
        </Body>
        <Right>
          <Text note> {this.props.time} </Text>
        </Right>
      </ListItem>
    );
  }
}

export default ListAvatarExample;