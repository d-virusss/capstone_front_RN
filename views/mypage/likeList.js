import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Container, Tabs, Tab, TabHeading, Content, Header, Left, Right, Icon, Body, Title} from 'native-base';
import LikeListUserScreen from './likeList_user';
import LikeList_Item from './likeList_item';
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

class LikeListScreen extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>관심 목록</Title></Body>
          <Right></Right>
        </Header>

        
        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ff3377' }}>
          <Tab heading="물품" activeTextStyle={{ color : '#ff3377' }}>
            <LikeList_Item navigation={this.props.navigation}></LikeList_Item>
          </Tab>

          <Tab heading="사용자" activeTextStyle={{ color: '#ff3377' }}>
            <LikeListUserScreen navigation={this.props.navigation}></LikeListUserScreen>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default LikeListScreen;
