import React, { Component } from 'react';
import { Content, Container, Item, Header, Left, Right, Title, Body, Label, Text, Button, Input, Form, Textarea, Icon } from 'native-base';
import { View, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, } from "react-native";
import CategoryPicker from './categorypicker';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageSelect from './imageselect';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'
import { CommonActions, StackActions } from '@react-navigation/native';

const image_info = {
  uri: '',
  type: '',
  name: ''
}
var formdata = new FormData();

class PostUpdate extends Component {

  params = this.props.route.params

  state = {
    post_id: this.params.my_post.id,
    title: this.params.my_post.title,
    category_id: String(this.params.my_post.category_id), // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차 유아용품
    price: String(this.params.my_post.price),
    body: this.params.my_post.body,
    image: this.params.my_post.image,
    token: "",
    loading : false,
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token)
  }

  componentDidMount() {
    this.getToken()
    console.log(this.params)
    // this.setState({image: formdata}, () => {console.log(this.state.image)})
  }

  setPostInfo = (data) => {
    formdata = new FormData();
    formdata.append('post[title]', this.state.title)
    formdata.append('post[category_id]', this.state.category_id)
    formdata.append('post[price]', this.state.price)
    formdata.append('post[body]', this.state.body)
    if(image_info.uri != ''){
      formdata.append('post[image]', image_info)
    }
    formdata.append('post[post_type]', "provide")
    console.log(formdata)
  }

  makeUpdateRequest() {
    console.log("Start create Post-provide")
    this.setState({loading : true})
    this.setPostInfo(this.state)
    console.log(formdata)

    this.setState({ loading: true })
    api
      .put(`/posts/${this.state.post_id}`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'postIndex' },],
          })
        );
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
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
    }, () => { console.log(this.state.image); })
    image_info.uri = data.sourceURL;
    image_info.type = data.mime;
    image_info.name = data.filename;
  }

  shownowstate() {
    // console.log(this.state)
    // console.log(image_info)
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
          <Body><Title>물품 정보 수정</Title>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ marginRight: '4%' }}
              onPress={() => this.makeUpdateRequest()}>
              <Text>수정완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <Spinner visible={this.state.loading}/>
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <KeyboardAvoidingView>
        <View style={styles.imageArea}>
          <ImageSelect stateBus={this.changeImage} existing_image={this.state.image} ></ImageSelect>
        </View>
        <Container>
          <TouchableOpacity onPress={this.shownowstate()} style={{ padding: 10 }}>
            <Text></Text>
          </TouchableOpacity>
          <Content>
            <Form>
              <Item inlinelabel>
                <Label>제목</Label>
                <Input autoCapitalize='none'
                  onChangeText={(text) => this.changedata(text, "title")}
                  value={this.state.title} />
              </Item>
              <CategoryPicker setParent={this.setSelect} existing_category={this.state.category_id} ></CategoryPicker>
              <Item inlinelabel last>
                <Label>가격</Label>
                <Input keyboardType="numeric"
                  onChangeText={(text) => this.changedata(text, "price")}
                  value={this.state.price} />
              </Item>
              <Textarea rowSpan={8} placeholder="게시글 내용을 입력해주세요" autoCapitalize='none'
                onChangeText={(text) => this.changedata(text, "body")}
                style={styles.textAreaContainer}
                value={this.state.body} />
            </Form>
          </Content>
        </Container>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  textAreaContainer: {
    marginHorizontal: '2%',
    marginTop: '5%'
  },
  imageArea: {
    marginVertical: 50,
    width: '70%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
})

export default PostUpdate;