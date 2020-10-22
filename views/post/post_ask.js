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
    }
  }
}
export default Post_ask;
