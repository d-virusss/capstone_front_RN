import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Form, Icon, Textarea, Item, Input, Button} from 'native-base';

import CategoryPicker from './categorypicker';
class PostShow extends Component{
    constructor(props){
        super(props);
        title = '화이트채플';
        category = '보드게임';
        price = 10000;
        bodytext = '어쩌구저쩌구';
    }
    render(){
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
                <Button style = {{alignSelf : 'center', marginTop : '3%'}}>
                  <Icon name = 'person'></Icon>
                  <Text>거래요청</Text>
                </Button>
              </Form>
            </View>
          </View>
        </ScrollView>
      );
    }
}

export default PostShow;