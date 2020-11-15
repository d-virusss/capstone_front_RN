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
  name: '',
}
var formdata = new FormData()
class Post_provide extends Component {
  state = {
    title: "",
    category_id: "", // 잡화 의류 뷰티 전자제품 레져용품 생활용품 요리 자동차 유아용품
    price: "",
    body: "",
    image: {},
    token: "",
    contract:
`제 1 조 본 계약에서 대여물건이라 함은 계약서 상단에 기재된 것을 말한다.\n
제 2 조 대여물건의 대여료는 금 --원으로 정하고 '을'은 계약과 동시에 '갑'에게 지급한다.\n
제 3 조 대여물건에 관한 화재보험료는 '을'이 부담하고 화재보험금의 수취인 명의는 '갑'으로 한다.\n
제 4 조 '을'은 '갑'의 동의 없이 대여물건을 타인에게 판매, 양도, 대여할 수 없다.\n
제 5 조 '을'은 대여물건에 대하여 항상 최선의 주의를 하며 선량한 관리자의 주의로써 상용하고 손상, 훼손하지 않도록 노력한다. 만약 '을'의 귀책사유로 손해가 발생한 경우는 즉시 '갑'에게 보고하고 '을'의 비용으로 완전히 보상한다.\n
제 6 조 '을'은 '갑'의 허가 없이 대여물건의 개조 또는 개수를 할 수 없다.\n
제 7 조 본 계약이 완료했을 경우 '을'은 즉시 대여물건을 보수완비하고 '갑'에게 반환한다.\n
제 8 조 전조 각항에 위반할 경우 '갑'은 '을'에 대한 보상 없이 '갑'의 단독의사로 계약을 해제할 수 있다.\n
제 9 조 본 계약의 조항 이외의 분쟁이 발생하였을 때는 '갑'과 '을'이 협의하여 정한다.
    `,

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
    formdata = new FormData();
    formdata.append('post[title]', this.state.title)
    formdata.append('post[category_id]', this.state.category_id)
    formdata.append('post[price]', this.state.price)
    formdata.append('post[body]', this.state.body)
    if(image_info.uri != ''){
      formdata.append('post[image]', image_info)
    }
    formdata.append('post[post_type]', "provide")
    formdata.append('post[contract]', this.state.contract)
    console.log(formdata)
    console.log(this.state.token)
  }

  makePostRequest() {
    console.log("Start create Post-provide")
    this.setPostInfo()
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
        this.props.navigation.goBack()
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
  },
})

export default Post_provide;