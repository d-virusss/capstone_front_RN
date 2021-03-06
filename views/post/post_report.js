import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, 
  Text, Content, ListItem, List, Separator, 
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';


//report detail에 신고타입 id만 넘겨주면됌.
class PostReportScreen extends Component {
  post = this.props.route.params

  state = {
    token : '',

  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token)
  }

  componentDidMount() {
    console.log("component did mount --- report")
    this.getToken()
    
   
  }
  
  render() {
    console.log("신고하기================")
    console.log(this.props.route.params.post.user.user_info)
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
          <Body><Title style={{ color: 'black', alignSelf: 'center', fontSize: 20}}>신고하기</Title></Body>
          <Right></Right>
        </Header>

        <Content>
          <List>
            <ListItem itemHeader first style={{ flexDirection: 'column' }}>
              <Text style={styles.reportreason}>'{this.post.post.post_info.title}'</Text>
              <Text style={styles.reportreason}> 게시글을 신고하는 이유를 선택해주세요.</Text>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post, reason : 'fake_item', type: 'post' }) }}>
              <Left style={styles.elmargin}>
                <Text>허위 매물이에요.</Text> 
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post, reason : 'unsuitable_post', type: 'post' }) }}>
              <Left style={styles.elmargin}>
                <Text>부적절한 게시물이에요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.props.navigation.navigate("ReportDetail", { post: this.post.post, reason : 'fraud', type: 'post' })}}>
              <Left style={styles.elmargin}>
                <Text>사기가 의심돼요.</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("ReportDetail", { post: this.post.post, reason : 'etc', type: 'post' })}}>
              <Left style={styles.elmargin}>
                <Text>기타 사유</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem itemHeader first>
              <Text style={styles.reportreason}>'{this.post.post.user.user_info.nickname}'</Text>
              <Text style={styles.reportreason}> 신고</Text>
            </ListItem>

            <ListItem button onPress={() => { this.props.navigation.navigate("PostUserReport", { post: this.post.post.user.user_info }) }}>
              <Left style={styles.elmargin}>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 사용자 신고</Text>
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
  reportreason :{
    fontSize : 20,
    fontWeight : 'bold',
    marginTop: 10
  },
  elmargin : {
    marginLeft : 10,
  },
});
export default PostReportScreen;
