import React, { Component } from 'react';
import { Content, Container, Item, Header, Left, Right, Title, Body, Label, Text, Button, Input, Form, Textarea, Icon } from 'native-base';
import { View, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity } from "react-native";
import CategoryPicker from './categorypicker';
import ImageSelect from './imageselect';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'

const image_info = {
  uri: '',
  type: '',
  name: ''
}
const formdata = new FormData();

class Post_provide extends Component {
  state = {
    title: "",
    category_id: "", // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차 유아용품
    price: "",
    body: "",
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
    // this.setState({image: formdata}, () => {console.log(this.state.image)})
  }

  setPostInfo = (data) => {
    formdata.append('post[title]', this.state.title)
    formdata.append('post[category_id]', this.state.category_id)
    formdata.append('post[price]', this.state.price)
    formdata.append('post[body]', this.state.body)
    formdata.append('post[image]', image_info)
    formdata.append('post[post_type]', "provide")
    console.log(formdata)
    console.log(this.state.token)
  }

  makePostRequest() {
    console.log("Start create Post-provide")
    this.setPostInfo(this.state)
    console.log(formdata)
    if(this.state.title.length ===  0){
      Alert.alert("제목을 입력해주세요");
      return;
    }
    if(this.state.category_id.length === 0){
      Alert.alert("카테고리를 설정해주세요");
      return;
    }
    if(this.state.price.length === 0){
      Alert.alert("가격을 입력해주세요")
      return;
    }
    if(this.state.body.length === 0){
      Alert.alert("게시글내용을 입력해주세요")
      return;
    }
    else if(this.state.body.length < 10){
      Alert.alert("게시글내용이 너무 짧습니다")
      return;
    }
    api
      .post('/posts', (formdata), {
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
      image: data
    }, () => {console.log(this.state.image);})
    image_info.uri = data.sourceURL;
    image_info.type = data.mime;
    image_info.name = data.filename;
  }

  shownowstate(){
    console.log(this.state)
    console.log(image_info)
  }

  render() {
    return (
      <ScrollView>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>물품 등록</Title>
          </Body>
          <Right>
            <TouchableOpacity 
              style={{ marginRight: '4%' }}
              onPress={() => this.makePostRequest()}>
              <Text>완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.imageArea}>
          <ImageSelect stateBus={this.changeImage} ></ImageSelect>
        </View>
        <Container>
          <TouchableOpacity onPress={this.shownowstate()} style={{ padding: 10 }}>
            <Text>지금 어떄</Text>
          </TouchableOpacity>
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
  imageArea : {
    marginVertical: 50, 
    width: '70%',
    height : 200,
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center'
  }
})

export default Post_provide;