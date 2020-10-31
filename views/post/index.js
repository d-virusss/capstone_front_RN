import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  StatusBar, TextInput,
  TouchableOpacity
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Footer, FooterTab, Badge, Button, Text, Icon, Tabs, Tab, TabHeading, ActionSheet, Root } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import { Overlay } from 'react-native-elements';
import ProvidingList from './provide_index';
import A_F_Rent from './ask_index';
import Example from './categorymodal';
import FootTab from '../shared/bottom_tab'
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
    console.log("enter post index")
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