import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import {Text, Form, Icon, Textarea, Item, Input, Button, Footer, FooterTab,} from 'native-base';

import DB2 from '../../assets/ddbb2.jpg'

const api = axios.create({ baseURL: 'http://3.35.9.144'});

class PostShow extends Component{

  state = {
    token: "",
  };

  getToken = async () => {
    try{
      const value = await AsyncStorage.getItem('token');
      if (value !== null) this.token = value;
    } catch (error){
      console.log("error : ", error);
    }
  }

  componentDidMount(){
    console.log('------- enter post_show -------');
  }

  chatCreateRequset(){
    api
      .post(`/chats?post_id=${2}`, null,{ headers : {
        'Authorization': this.token
      }})
      .then((response) => {
        console.log('success');
        console.log(this.token);
        console.log(response);
      })
      .catch((err) => console.log("err : ", err))
  }

  makeCallchat_navigate(){
    this.chatCreateRequset();
    this.props.navigation.navigate('ChatRoom', {postId : 2, check : 0,});
  }

  render(){
    const { params } = this.props.route;
    console.log(params)
    console.log(params.post.post_info.title)
    console.log(params.post.post_info.image)
    const product_image = params ? params.post.post_info.image : null
    const title = params ? params.post.post_info.title : "기본 이름 ㅎ"
    const price = params ? params.post.post_info.price : "1399"
    const body = params ? params.post.post_info.body : "생각보다 재밌습니다! 연락주세요"
    const id = params ? params.post.post_info.id : null;
    this.getToken();
    return(
      <View style={{flex : 1}}>
        <ScrollView style={styles.container} >
          <View style = {styles.imageArea}>
            <Image source={{ uri : product_image }} style={styles.imageView} />
          </View>
          <View>
            <View>
              <Form>
                <Item regular style={styles.componentMargin}>
                    <Text style={styles.fontView}>{title}</Text>
                </Item>
                <Item regular style={styles.componentMargin}>
                    <Text style={styles.fontView}>보드게임</Text>
                </Item>
                <Item regular style = {styles.componentMargin}>
                    <Text style={styles.fontView}>1일 / {price + '원'}</Text>
                </Item>
                <Item regular style = {styles.componentMargin}>
                    <Text style={styles.fontView}>{body}</Text>
                </Item>
              </Form>
            </View>
          </View>
        </ScrollView>

        <Footer>
          <FooterTab>
            <Button style={{marginLeft:-30}}>
              <Icon name="heart" />
            </Button>
            <Text style={{width: '30%', alignSelf: "center"}}>
              3,000원 / 1 일
            </Text>
            <Button bordered warning onPress={() => { this.makeCallchat_navigate()}}
                     style={{flexDirection: 'row', width:'40%', marginTop:10}}>
              <Text>채팅으로 대여하기</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    paddingBottom : 50,
    flex : 1
  },
  imageArea : {
    width: '95%',
    height : '60%',
    justifyContent : 'center',
    alignItems : 'center',
    alignSelf : 'center'
  },
  componentMargin : {
    marginBottom : '15%',
  },
  fontView : {
    fontSize : 17,
    margin : '5%'
  },
  imageView : {
    width: '90%',
    height: 300
  }
})

export default PostShow;