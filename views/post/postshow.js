import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Form, Icon, Textarea, Item, Input, Button} from 'native-base';

const api = axios.create({baseURL: 'http://52.79.179.211'});

class PostShow extends Component{
    constructor(props){
        super(props);
        title = '화이트채플';
        category = '보드게임';
        price = 10000;
        bodytext = '어쩌구저쩌구';
        state = {
          token : '',
          postid : 0
        };
    }

    chatCreateRequset(){
      api
        .post('/chats',
        {
          headers : {'Authorization' : this.token},
          post_id : 0
        })
        .then((response) => {
          console.log("create success!")
          console.log(response)
          this.setState({token : response.data.token})
          this.token = AsyncStorage.getItem("token")
            .catch((err) => console.log("err : ", err))
        })
        .catch(function (error) {
          console.log('axios call failed!! : ' + error);
        });
    }

    createAndNavigate(){
      this.chatCreateRequset();
      this.props.navigation.navigate('ChatRoom');
    }

    auth(){
      AuthStr = 'Bearer '.concat(this.token); 
      axios.get('http://52.79.179.211', { headers: { Authorization: AuthStr } })
        .then(response => {
          // If request is good...
          console.log(response.data);
      })
        .catch((error) => {
            console.log('error ' + error);
        });  
    }

    render(){
      this.auth();
      return(
        <ScrollView>
          <View style={{width : '95%', height : '40%', justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
            <Text>이미지</Text>
          </View>
          <View style = {{ alignItems : 'center'}}>
            <View style = {{ width : '95%',}}>
              <Form>
                <Item regular style = {{marginBottom : '3%'}}>
                    <Text style = {{fontSize : 17, margin : '4%'}}>{title}</Text>
                </Item>
                <Item regular style = {{marginBottom : '3%'}}>
                    <Text style = {{fontSize : 17, margin : '4%'}}>{category}</Text>
                </Item>
                <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                    <Text style = {{fontSize : 17, margin : '4%'}}>{price + '원'}</Text>
                </Item>
                <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                    <Text style = {{fontSize : 17, margin : '4%'}}>{bodytext}</Text>
                </Item>
                <Button style = {{alignSelf : 'center', marginTop : '3%'}}
                  onPress = {() => this.createAndNavigate()}
                >
                  <Icon name = 'person'></Icon>
                  <Text>채팅 거래하기</Text>
                </Button>
              </Form>
            </View>
          </View>
        </ScrollView>
      );
    }
}

export default PostShow;