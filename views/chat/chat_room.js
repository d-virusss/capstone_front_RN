import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet
} from 'native-base';

class ChatRoom extends Component{
    render(){
        return(
            <Container>
                <Content>
                    <Text>채팅에 옴</Text>
                </Content>
            </Container>
        );
    }
}

export default ChatRoom;