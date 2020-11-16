import React, { Component } from 'react';
import Vector_Icon from 'react-native-vector-icons/AntDesign'
Vector_Icon.loadFont()
import { Header, Content, Form, Item, Picker, Icon, Text, Label } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class CategoryPicker extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.existing_category != undefined ? this.props.existing_category : undefined,
      
    };
  }

  seleçtedValue(value) {
    this.setState({
      selected: value
    }, () => {
      console.log(this.state.selected)
      this.props.setParent(this.state.selected)
    });
  }

  render() {
    return (
        <Item picker style={{ justifyContent: "space-between" }}>
          <Label style={{ fontSize: 17, paddingHorizontal: '3%', marginLeft: '1%' }}>카테고리</Label>
          <Picker
            mode="dropdown"
            iosIcon={<Icon type="AntDesign" name="down" />}
            placeholder="선택"
            placeholderStyle={{ color: "gray", }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.selected}
            onValueChange={this.seleçtedValue.bind(this)}
          >
            <Picker.Item label="잡화" value="1" />
            <Picker.Item label="의류" value="2" />
            <Picker.Item label="뷰티" value="3" />
            <Picker.Item label="전자제품" value="4" />
            <Picker.Item label="레져용품" value="5" />
            <Picker.Item label="생활용품" value="6" />
            <Picker.Item label="요리" value="7" />
            <Picker.Item label="자동차" value="8" />
            <Picker.Item label="유아용품" value="9" />
          </Picker>
        </Item>
    );
  }
}