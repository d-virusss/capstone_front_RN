import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert,
  TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, 
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address'
import FormData from 'form-data'

var formdata = new FormData();
export default class Contract extends React.Component {

  my_post = this.props.route.params.my_post

  state = {
    token : "",
    title : "",
    post_id : this.my_post.id,
    body : this.my_post.contract,
    loading : false,
  };

  componentDidMount() {
    this.getToken();
    console.log(this.my_post)
    this.setState({
      post_id : this.my_post.post_id,
      body : this.my_post.contract,
    }, ()=> {console.log(this.state)})
    console.log('component did mount ----------------------')
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  setContract(data){
    formdata.append('post[contract]', this.state.body)
    console.log(formdata)
  }

  ContractUpdateRequest() {
    console.log("start update post data ---- add contract ")
    this.setContract(this.state)
    if(this.state.body.length > 499){
      Alert.alert("수정 실패", "게약서는 500자 이내로 작성해주세요.", [{ text: '확인', style: 'cancel' }])
      return;
    }

    api
      .put(`/posts/${this.state.post_id}`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        Alert.alert("수정 완료", "계약서가 수정되었습니다.", [
          {
            text: '확인',
            onPress: () => this.props.navigation.navigate("Main"),
          }
        ])
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
        Alert.alert("계약서 작성 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
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
              onPress={() => this.ContractUpdateRequest()}>
              <Text>완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <Spinner visible={this.state.loading} style={{ color: '#ff3377'  }} />
        <ScrollView>
          <Content style={{padding : 20}}>
            <Card style={ styles.card }>
              <CardItem header>
                <Text>물품임대 계약서</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>--(이하 “갑”이라 칭함.)와 --(이하 “을”이라 칭함.)와의 사이에 물품
                --의 대여(이하 “대여물건”이라 칭함.)에 관하여 다음과 같이 계약을 체결한다.
                    대여물건의 대여료는 금 -- 원으로 정한다.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView>
                      <View style={styles.textareaContainer}>
                        <TextInput multiline={true} numberOfLines={10}
                          style={styles.textarea}
                          onChangeText={(text) => this.setState({ body : text })}
                          value={this.state.body}/>
                      </View>
                    </KeyboardAvoidingView>
                  </TouchableWithoutFeedback>
                </Body>
              </CardItem>
              <CardItem footer>
                <Text>202*년 * 월 * 일
                </Text>
              </CardItem>
            </Card>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card : {
    padding : 10,
    margin : 10,
    alignItems : 'center',
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

