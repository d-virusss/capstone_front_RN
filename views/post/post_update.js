import React, { Component } from 'react';
import { Content, Container, Item, Header, Left, Right, Title, Body, Label, Text, Button, Input, Form, Textarea, Icon } from 'native-base';
import { View, ScrollView, StyleSheet, DeviceEventEmitter, Alert, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, } from "react-native";
import CategoryPicker from './categorypicker';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageSelect from './imageselect';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'
import _ from 'lodash';

const image_info = {
  uri: '',
  type: '',
  name: ''
}
var formdata = new FormData();
var multi_images = []

class PostUpdate extends Component {

  params = this.props.route.params

  state = {
    post_id:'',
    title: '',
    category_id: '', // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차 유아용품
    price: '',
    body: '',
    images : '',
    token: "",
    loading : true,
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  componentDidMount() {
    this.initInfo();
    this.getToken()
  }

  initInfo() {
    this.state.post_id = this.params.my_post.post_info.id;
    this.state.title= this.params.my_post.post_info.title;
    this.state.category_id= String(this.params.my_post.post_info.category_id); // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차 유아용품
    this.state.price= String(this.params.my_post.post_info.price);
    this.state.body= this.params.my_post.post_info.body;
    if(this.params.my_post.post_info.image_detail.length === 0){
      this.state.images = [this.params.my_post.post_info.image];
    }
    else{
      this.state.images = this.params.my_post.post_info.image_detail;
    }
    this.setState({loading : false})
  
  }

  setPostInfo = () => {
    formdata = new FormData();
    formdata.append('post[title]', this.state.title)
    formdata.append('post[category_id]', this.state.category_id)
    formdata.append('post[price]', this.state.price)
    formdata.append('post[body]', this.state.body)

    if (image_info.uri != '') {
			_.each(multi_images, (image, index) => {
				formdata.append(`post[images_attributes][${index}][image]`, image)
			})
			formdata.append('post[image]', image_info)
    }
    console.log(formdata)
  }

  makeUpdateRequest() {
    this.setState({loading : true})
    this.setPostInfo()

    api
      .put(`/posts/${this.state.post_id}`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        DeviceEventEmitter.emit('updateContent', {posts : this.state});

        Alert.alert("수정 완료",'게시물을 수정했습니다.',
        [
          {
            text:'확인', 
            onPress: () => {this.props.navigation.goBack();}
          },
          {
            style:'cancel'
          }
        ])
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
        this.props.navigation.goBack(); 
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
        images: text,
      }, () => { console.log(this.state.images) })
    }
  }

  setSelect = (data) => {
    this.setState({
      category_id: data
    })
  }

  changeImage = (data) => {
    this.setState({images: data})
    _.each(this.state.images, (image, index) => {
			multi_images.push(new Object)
			multi_images[index].uri = image.sourceURL
			multi_images[index].type = image.mime
			multi_images[index].name = image.filename
		})
    image_info.uri = data.sourceURL;
    image_info.type = data.mime;
    image_info.name = data.filename;
  }

  shownowstate() {
    // console.log(this.state)
    // console.log(image_info)
  }

  render() {
    if(this.state.loading){
      return(
        <ScrollView>
          <Header style = {{
            height: 60,
            backgroundColor: '#f8f8f8',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} androidStatusBarColor='#000'>
            <Left>
              <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='chevron-back' type='Ionicons' />
              </TouchableOpacity>
            </Left>
            <Body><Title>물품 정보 수정</Title></Body>
            <Right></Right>
          </Header>
          <Content><Spinner visible={this.state.loading} style={{ color: '#ff3377'}} /></Content>
        </ScrollView>
      )
    }else{
    return (
      <ScrollView>
        <Header style = {{
            height: 60,
            backgroundColor: '#f8f8f8',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} androidStatusBarColor='#000'    >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>물품 정보 수정</Title>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ marginRight: '4%' }} makeUpdateRequest
              onPress={() => {
                Alert.alert("게시물 수정", "게시물을 수정하시겠습니까?", [
                  {
                    text: '확인',
                    onPress: () => this.makeUpdateRequest()
                  },
                  {
                    text: '취소',
                    style: 'cancel',
                  }
                ])
              }}>
              <Text>수정 완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
          <KeyboardAvoidingView>
        <View style={styles.imageArea}>
          <ImageSelect stateBus={this.changeImage} existing_image={this.state.images} />
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
    );}
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