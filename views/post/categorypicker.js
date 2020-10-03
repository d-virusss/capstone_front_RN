import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Picker, Icon, Text } from 'native-base';
export default class CategoryPicker extends Component {
    constructor(props) {
    super(props);
    this.state = {
      selected2: undefined
    };
  }
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }
  render() {
    return (
      <Item picker regular>
        <Text style = {{fontSize : 17, padding : '2%',}}>카테고리</Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: undefined ,}}
          placeholder="카테고리"
          placeholderStyle={{ color: "gray" , alignSelf : 'center'}}
          placeholderIconColor="#007aff"
          selectedValue={this.state.selected2}
          onValueChange={this.onValueChange2.bind(this)}
        >
          <Picker.Item label="전자제품" value="key0" />
          <Picker.Item label="바닐라라때" value="key1" />
          <Picker.Item label="닥터페퍼" value="key2" />
          <Picker.Item label="유린기" value="key3" />
          <Picker.Item label="꿍보찌딩" value="key4" />
        </Picker>
      </Item> 
    );
  }
}