import React, { Component} from "react";
import { View} from "react-native";
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import BottomTab from "../shared/bottom_tab";
IconM.loadFont();

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