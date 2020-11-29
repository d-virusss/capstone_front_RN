import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import {
  Container, Content, Header, Left, Right, Body, Icon,
  Title, Text, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail,
} from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

class ProfileAsk extends Component {
  state = {
    token: '',
    myId: this.props.route.params.user_id,
    provide_post: [], //user's providing list
    ask_post: [], //user's asking list
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    const id = await AsyncStorage.getItem("user_id")
    this.state.token = value
    this.state.myId = id
    this.askPostRequest();
  }

  componentDidMount() {
    this.getToken()
  }

  askPostRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=ask`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log(res)
        this.setState({ ask_post: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  makeIndexList(posts) {
    return posts.map((post) => {
      console.log(post)
      return (
        <ListItem thumbnail key={post.post_info.id} button
          onPress={() => this.props.navigation.navigate('PostShow', { post_id: post.post_info.id })}>
          <Left>
            <Thumbnail square source={{ uri: post.post_info.image }} />
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
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>요청 상품</Title></Body>
          <Right></Right>
        </Header>

        <Content>
          <List>
            {this.makeIndexList(this.state.ask_post)}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor: '#50cebb',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
});

export default ProfileAsk;