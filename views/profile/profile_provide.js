import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading, Thumbnail, Badge,
  FooterTab, Footer
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import ReceiveList from '../mypage/reservationReceive'

class ProfileProvide extends Component {
  state = {
    token: '',
    myId: this.props.route.params.user_id,
    posts : [],
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(value)
    this.providePostRequest();
    this.afterRequest();
  }

  componentDidMount() {
    this.getToken()
    console.log('component did mount -------------')
  }
  
  providePostRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=provide`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        this.setState({ posts: res.data })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }


  renderPost(posts) {
    return posts.map((post) => {
      console.log(post)
      return (
        <ListItem thumbnail key={post.post_info.id} button
          onPress={() => this.props.navigation.push('PostShow', { post_id: post.post_info.id })}>
          <Left>
            <Thumbnail square source={post.post_info.image=='/image/default.png' ? require('../../assets/default.png') :{ uri: post.post_info.image }} />
          </Left>
          <Body>
            <Text>{post.post_info.title}</Text>
            <Text note numberOfLines={1}>{post.post_info.body}</Text>
          </Body>
        </ListItem>
      )
    })
  }

  render() {
    return (
      <Container>
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent: 'space-between'
        }}
          androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{ fontSize: 20 }}>등록한 물품</Title></Body>
          <Right></Right>
        </Header>

        <Content>
          <List>
            {this.renderPost(this.state.posts)} 
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  returnbutton: {
    fontSize: 13,
    fontWeight: '400',
    color: 'black'
  }
});

export default ProfileProvide;