import React, { Component} from "react";
import { View} from "react-native";
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import BottomTab from "../shared/bottom_tab";
IconM.loadFont();

var BUTTONS = ["대여품 등록", "대여요청하기", "취소"];
var CANCEL_INDEX = 2;

class PostIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }} >
          <Search_Bar navigation={this.props.navigation}></Search_Bar>
        </View>
        <BottomTab navigation={this.props.navigation}></BottomTab>
      </View>
    );
  }
}

export default PostIndex;