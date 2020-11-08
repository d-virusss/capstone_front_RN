import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Container, Content, Header, Left, Right, Body, Icon,
  Button, Text, View, List, ListItem, Tabs, Tab, TabHeading,
  Thumbnail
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../shared/server_address'

class myItemListScreen extends Component{
  state = {
    token : '',
    myId:'',
    posts1 : [], //user's providing list
    posts2 : [], //user's asking list
  }

  makeIndexList(posts){
    return posts.map((post) => {
      console.log(post.title)
      return(
        <ListItem thumbnail key={post.post_info.id}>
          <Left>
            <Thumbnail square source={{ uri: post.post_info.image }} />
          </Left>
          <Body>
            <Text>{post.post_info.title}</Text>
            <Text note numberOfLines={1}>{post.post_info.body}</Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.showPostRequset(post.post_info.id)}>
              <Text>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity transparent onPress={() => this.showPostRequset(post.post_info.id)}>
              <Text>삭제</Text>
            </TouchableOpacity>
          </Right>
        </ListItem>
      )
    })
  }

  showPostRequset(id){
    console.log("show request")
    api
      .get(`/posts/${id}`, { headers : {
        'Authorization': this.state.token
      }})
      .then(function(response) {
        console.log('success');
        this.props.navigation.navigate('PostShow', { post: response.data })
      }.bind(this))
      .catch((err) => console.log("err : ", err))
  }

  sendProvideIndexRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=provide`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("index send success!")
        console.log()
        this.setState({posts1:res.data}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  sendAskIndexRequest() {
    api
      .get(`/users/${this.state.myId}/list?post_type=ask`, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("index send success!")
        this.setState({posts2:res.data}, ()=> { })
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  getToken = async () => {
    const value = await AsyncStorage.getItem("token")
    const id =  await AsyncStorage.getItem("user_id")
    this.state.token = value
    this.state.myId = id
    this.sendProvideIndexRequest();
    this.sendAskIndexRequest();
  }

  componentDidMount(){
    this.getToken()
  }

  render(){
    return(
      <Tabs>
        <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}>
          <Content>
            <List>
              {this.makeIndexList(this.state.posts1)}
            </List>
          </Content>
        </Tab>
        <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
          <List>
            {this.makeIndexList(this.state.posts2)}
          </List>
        </Tab>
        </Tabs>
    );
  }
}

export default myItemListScreen;