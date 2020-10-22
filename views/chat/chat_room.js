import React, { Component, useState, useCallback, useEffect } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet, Textarea
} from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function ChatRoom({navigation : {goBack}}) {
  const [messages, setMessages] = useState([]);

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

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <Container>
      <Header style = {{height : 56}}>
        <Left>
          <Button transparent onPress = {() => goBack()}>
            <Icon name = 'arrow-back'/>
          </Button>
        </Left>
        <Body>
          <Text style = {{fontSize : 18}}>채팅</Text>
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
  )
}

export default ChatRoom;