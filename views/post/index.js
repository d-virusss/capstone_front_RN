import React, { Component} from "react";
import { View} from "react-native";
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchBar from './search_bar';
import BottomTab from "../shared/bottom_tab";
IconM.loadFont();

class PostIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }} >
          <SearchBar navigation={this.props.navigation}></SearchBar>
        </View>
        <BottomTab navigation={this.props.navigation}></BottomTab>
      </View>
    );
  }
}

export default PostIndex;