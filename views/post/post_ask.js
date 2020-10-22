import React, {Component} from 'react';
import { Content,Item, Thumbnail, Text, Left, Body, Right, Button, Input, Form, Textarea, Icon } from 'native-base';
import {
    View, ScrollView
  } from "react-native";
import CategoryPicker from './categorypicker';
import ImageSelect from './imageselect';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const api = axios.create({ baseURL: 'http://52.79.179.211' });

<<<<<<< HEAD
let post_info = {
  post: {
    title: "",
    body: "",
    price: "",
    category_id: "",
    image: "",
    post_type: "ask", // ask or provide
  }
}

class Post_ask extends Component{
  state = {
    title: "",
    body: "",
    price: "",
    category_id: "", // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차
    image: "",
    token: ""
  }
  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token)
  }

  componentDidMount() {
    this.getToken()
    console.log("component did mount ---")
  }

  setPostInfo = (data) => {
    post_info.post.title = data.title
    post_info.post.body = data.body
    post_info.post.price = data.price
    post_info.post.category_id = data.category_id
    post_info.post.image = data.image
    console.log(post_info)
    console.log(this.state.token)
  }

  makePostRequest() {
    console.log("Start create Post")
    this.setPostInfo(this.state)
    api
      .post('/posts', post_info, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        this.props.navigation.navigate("postIndex")
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e)
      })
  }

  changedata = (text, type) => {
    if (type === "title") {
      this.setState({
        title: text,
      }, () => { console.log(this.state.title) })
=======
  class Post_ask extends Component{
    render(){
      return(
        <ScrollView>
          <View style={{width : '95%', height : '40%', justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
            
            <ImageSelect></ImageSelect>
          </View>
          <View style = {{ alignItems : 'center'}}>
            <View style = {{ width : '95%',}}>
              <Form>
                <Item regular style = {{marginBottom : '3%'}}>
                  <Input placeholder = '제목'/>
                </Item>
                <View>
                  <CategoryPicker></CategoryPicker>
                </View>
                <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                  <Input placeholder = '희망가격'/>
                </Item>
                <Textarea rowSpan = {10} bordered placeholder = "내용" />
                <Button style = {{alignSelf : 'center', marginTop : '3%'}}>
                  <Icon name = 'person'></Icon>
                  <Text>제출완료</Text>
                </Button>
              </Form>
            </View>
          </View>
        </ScrollView>
        
      );
>>>>>>> parent of 0a330e4... post 생성 완료
    }
  }

  export default Post_ask;