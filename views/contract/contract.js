import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import CustomButton from '../login/custom_button';
import { Container, Content, Form, Item, Input, Label, Button, Text, 
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea } from 'native-base';
import api from '../shared/server_address'
import FormData from 'form-data'

const contract = {
  title : "",
  body : "",
}
var formdata = new FormData();
export default class Contract extends React.Component {
  state = {
    token : "",
    title : "",
    post_id : "",
    body : "제 1 조 본 계약에서 대여물건이라 함은 명세서에 기재된 것을 말한다.",
  };

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  makeContractRequest() {
    console.log("start update post data ---- add contract ")
    api
      .put(`/posts/${this.state.post_id}`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        // this.props.navigation.navigate("postIndex")
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>계약서 작성</Title>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ marginRight: '4%' }}
              onPress={() => this.makeContractRequest()}>
              <Text>완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <Content style={{padding : 20}}>
          <Card style={ styles.card }>
            <CardItem header>
              <Text>물품임대 계약서</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>--(이하 “갑”이라 칭함.)와 --(이하 “을”이라 칭함.)와의 사이에 물품
               의 대여(이하 “대여물건”이라 칭함.)에 관하여 다음과 같이 계약을 체결한다.</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <View style={styles.textareaContainer}>
                  <TextInput multiline={true} numberOfLines={10}
                    placeholder="textinput의 기본텍스트입니다"
                    style={styles.textarea}
                    onChangeText={(text) => this.setState({ body : text })}
                    value={this.state.body}

                  ></TextInput>
                </View>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card : {
    padding : 10,
    margin : 10,
    alignItems : 'center',
    height : 700
  },
  textareaContainer : {
    borderColor: '#dddddd',
    borderRadius : 3,
    borderWidth: 1,
    padding: 10,
    width : '100%',
  },
  textarea : {
    height: 500,
    
  },
});

