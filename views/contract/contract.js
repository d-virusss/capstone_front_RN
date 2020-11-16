import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, 
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'

var formdata = new FormData();
export default class Contract extends React.Component {

  my_post = this.props.route.params.my_post

  state = {
    token : "",
    title : "",
    post_id : this.my_post.id,
    body : 
`제 1 조 본 계약에서 대여물건이라 함은 계약서 상단에 기재된 것을 말한다.\n
제 2 조 대여물건의 대여료는 계약과 동시에 '을'이 '갑'에게 지급한다.\n
제 3 조 대여물건에 관한 화재보험료는 '을'이 부담하고 화재보험금의 수취인 명의는 '갑'으로 한다.\n
제 4 조 '을'은 '갑'의 동의 없이 대여물건을 타인에게 판매, 양도, 대여할 수 없다.\n
제 5 조 '을'은 대여물건에 대하여 항상 최선의 주의를 하며 선량한 관리자의 주의로써 상용하고 손상, 훼손하지 않도록 노력한다. 만약 '을'의 귀책사유로 손해가 발생한 경우는 즉시 '갑'에게 보고하고 '을'의 비용으로 완전히 보상한다.\n
제 6 조 '을'은 '갑'의 허가 없이 대여물건의 개조 또는 개수를 할 수 없다.\n
제 7 조 본 계약이 완료했을 경우 '을'은 즉시 대여물건을 보수완비하고 '갑'에게 반환한다.\n
제 8 조 전조 각항에 위반할 경우 '갑'은 '을'에 대한 보상 없이 '갑'의 단독의사로 계약을 해제할 수 있다.\n
제 9 조 본 계약의 조항 이외의 분쟁이 발생하였을 때는 '갑'과 '을'이 협의하여 정한다.
    `,
  };

  componentDidMount() {
    this.getToken();
    console.log(this.state)
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  setContract(data){
    formdata.append('post[contract]', this.state.body)
    console.log(formdata)
  }

  makeContractRequest() {
    console.log("start update post data ---- add contract ")
    this.setContract(this.state)
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
              onPress={() => this.makeContractRequest()}>
              <Text>완료</Text>
            </TouchableOpacity>
          </Right>
        </Header>
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
                  <View style={styles.textareaContainer}>
                    <TextInput multiline={true} numberOfLines={10}
                      style={styles.textarea}
                      onChangeText={(text) => this.setState({ body : text })}
                      value={this.state.body}

                    ></TextInput>
                  </View>
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

