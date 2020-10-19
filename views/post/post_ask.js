import React, {Component} from 'react';
import { Content,Item, Thumbnail, Text, Left, Body, Right, Button, Input, Form, Textarea, Icon } from 'native-base';
import {
    View, ScrollView
  } from "react-native";
import CategoryPicker from './categorypicker';
import ImageSelect from './imageselect';

  class Post_ask extends Component{
    render(){
      return(
        <ScrollView>
          <View style={{width : '95%', height : '40%', justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
            
            <ImageSelect></ImageSelect>
          </View>
          <View style = {{ alignItems : 'center'}}>
            <View style = {{ width : '95%',}}>
              <Form>
                <Item regular style = {{marginBottom : '3%'}}>
                  <Input placeholder = '제목'/>
                </Item>
                <View>
                  <CategoryPicker></CategoryPicker>
                </View>
                <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                  <Input placeholder = '희망가격'/>
                </Item>
                <Textarea rowSpan = {10} bordered placeholder = "내용" />
                <Button style = {{alignSelf : 'center', marginTop : '3%'}}>
                  <Icon name = 'person'></Icon>
                  <Text>제출완료</Text>
                </Button>
              </Form>
            </View>
          </View>
        </ScrollView>
        
      );
    }
  }

  export default Post_ask;