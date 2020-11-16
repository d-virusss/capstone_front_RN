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

        <Content>
          <Tabs>
          <Tab heading={ <TabHeading transparent><Text>품목</Text></TabHeading>}>
              <LikeList_Item navigation={this.props.navigation}></LikeList_Item>
            </Tab>

            <Tab heading={ <TabHeading transparent><Text>유저</Text></TabHeading>}>
              <LikeListUserScreen navigation={this.props.navigation}></LikeListUserScreen>
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
}

export default LikeListScreen;
