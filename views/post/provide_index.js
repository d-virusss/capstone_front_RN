import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
const api = axios.create({ baseURL: 'http://3.35.9.144' });

class ProvideIndex extends Component{
  state = {
    token : '',
    posts : [],
  }

  makeIndexList(){
    console.log(this.state.posts)
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() => this.props.navigation.navigate('PostShow', {
          post : post,
        })}>
          <ListItem thumbnail key={post.post_info.id}>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text>{post.post_info.title}</Text>
              <Text note numberOfLines={1}>{post.post_info.body}</Text>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.navigation.navigate('PostShow')}>
                <Text>보기</Text>
              </Button>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest() {
    console.log("give me post-index!-----------------")
    api
      .get('/posts?post_type=provide', {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("index send success!")
        console.log(res)
        this.setState({posts:res.data}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
    api
      .get('/posts/1', {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("post-show success!!")
        console.log(res)
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.sendIndexRequest()
  }

  componentDidMount(){
    console.log("render post-provide")
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

export default ProvideIndex;