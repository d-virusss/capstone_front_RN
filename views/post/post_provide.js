import React, { Component } from 'react';
import { Content, Container, Header, Item, Label, Text, Button, Input, Form, Textarea, Icon } from 'native-base';
import {
  View, ScrollView, StyleSheet, TextInput
} from "react-native";
import CategoryPicker from './categorypicker';
import ImageSelect from './imageselect';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

let post_info = {
  post: {
    title: "",
    body: "",
    price: "",
    category_id: "",
    image: {},
    post_type: "provide", // ask or provide
  }
}
;
const image_info = {
  uri: '../../assets/ddbb2.jpg',
  type: 'image/jpg',
  name: 'dduckbokki.jpg'
}
const file_data = new FormData();
file_data.append('file', image_info);

class Post_provide extends Component {
  state = {
    title: "",
    body: "",
    price: "",
    category_id: "", // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차
    image: {},
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
    this.setState({image: file_data}, () => {console.log(this.state.image)})
  }

  setPostInfo = (data) => {
    post_info.post.title = data.title
    post_info.post.body = data.body
    post_info.post.price = data.price
    post_info.post.category_id = data.category_id
    post_info.post.image = data.image._parts[0]
    console.log(post_info)
    console.log(this.state.token)
  }

  makePostRequest() {
    console.log("Start create Post-provide")
    this.setPostInfo(this.state)
    api
      .post('/posts', (post_info), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        this.props.navigation.navigate("postIndex")
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
      })
  }

  changedata = (text, type) => {
    if (type === "title") {
      this.setState({
        title: text,
      }, () => { console.log(this.state.title) })
    }
    else if (type === "body") {
      this.setState({
        body: text,
      }, () => { console.log(this.state.body) })
    }
    else if (type === "price") {
      this.setState({
        price: text,
      }, () => { console.log(this.state.price) })
    }
    else if (type === "image") {
      this.setState({
        image: text,
      }, () => { console.log(this.state.image) })
    }
  }

  setSelect = (data) => {
    this.setState({
      category_id: data
    })
  }

  changeImage = (data) => {
    this.setState({
      image: file_data
    }, () => {console.log('image setted');console.log(this.state.image); console.log(image_info); console.log(file_data)})
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginTop: 50, width: '70%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ImageSelect></ImageSelect>
        </View>
        <Container>
          <Header />
          <Content>
            <Form>
              <Item inlinelabel>
                <Label>제목</Label>
                <Input autoCapitalize='none'
                  onChangeText={(text) => this.changedata(text, "title")} />
              </Item>
              <CategoryPicker setParent={this.setSelect}></CategoryPicker>
              <Item inlinelabel last>
                <Label>가격</Label>
                <Input keyboardType="numeric"
                  onChangeText={(text) => this.changedata(text, "price")} />
              </Item>
              <Textarea rowSpan={8} placeholder="게시글 내용을 입력해주세요" autoCapitalize='none'
                onChangeText={(text) => this.changedata(text, "body")}
                style={styles.textAreaContainer} />
              <Button style={{ alignSelf: 'center', marginTop: '3%' }}
                onPress={() => this.makePostRequest()} >
                <Icon name='person'></Icon>
                <Text>완료</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  textAreaContainer: {
    marginHorizontal: '2%',
    marginTop: '5%'
  },
})

export default Post_provide;