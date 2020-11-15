import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { ScrollView } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'

class AskIndex extends Component{
  state = {
    token : '',
    posts : [],
  }

  //category_id = this.props.

  makeIndexList() {
    console.log(this.state.posts)
    return this.state.posts.map((post) => {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PostShow', { post: post }) } key={post.post_info.id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text>{post.post_info.title}</Text>
              <Text note numberOfLines={1}>{post.post_info.body}</Text>
            </Body>
            <Right>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest() {
    console.log("give me post-index!-----------------")
    api
      .get('/posts?post_type=ask', {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("ask_index send success!")
        console.log(res)
        this.setState({ posts: res.data }, () => { })
      })
      .catch(function (e) {
        console.log('send post-ask failed!!!!' + e)
      })
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.sendIndexRequest()
  }

  componentDidMount() {
    console.log("render post-ask")
    this.getToken()
  }

  render(){
    return(
      <ScrollView style={{flex : 1}}>
        <Content>
          <List>
            {this.makeIndexList()}
          </List>
        </Content>
      </ScrollView>
    );
  }
}

export default AskIndex;