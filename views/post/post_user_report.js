import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity } from 'react-native';
import {
  Container, Header, Left, Body, Right, Button, Icon, Title,
  Text, Content, ListItem, List, Separator,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class PostUserReportScreen extends Component {
  post = this.props.route.params // need nickname, 

  state = {
    token: '',

  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  componentDidMount() {
    this.getToken()
  }


  render() {
    console.log("----------user-------------")
    console.log(this.post)
    return (
      <Container>

        <Header style = {{
            backgroundColor: '#f8f8f8',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} androidStatusBarColor='black'
        >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{ alignSelf: 'center', color: 'black', fontSize: 20}}>신고하기</Title></Body>
          <Right></Right>
        </Header>

        <Content>
          <List>
            <ListItem itemHeader first style={{ flexDirection: 'column'}}>
              <Text style={styles.reportreason}>'{this.post.post.nickname}'</Text>
              <Text style={styles.reportreason}> 이 사용자를 신고하는 이유를 선택해주세요.</Text>
            </ListItem>

            <Separator bordered></Separator>
            {/* pass user's id */}
            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post : this.post.post.id, reason: 'break_rule', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>계약사항을 지키지 않아요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post : this.post.post.id, reason: 'lost_contact', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>대여 후 연락이 두절됐어요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post.id, reason: 'impertinence', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>무례하거나, 혐오스런 표현 혹은 차별적 발언을 해요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post.id, reason: 'fraud', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>사기가 의심돼요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post.id, reason: 'threat_violence', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>폭력 및 협박, 위협을 가해요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post:this.post.post.id, reason: 'etc', type: 'user' }) }}>
              <Left style={styles.elmargin}>
                <Text>기타 사유</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>
          </List>
        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  reportreason: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  elmargin: {
    marginLeft: 10,
  },
});
export default PostUserReportScreen;
