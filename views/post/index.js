import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  StatusBar, TextInput,
  TouchableOpacity 
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Footer, FooterTab, Badge, Button,Text, Icon,Tabs, Tab, TabHeading, ActionSheet, Root } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import {Overlay} from 'react-native-elements';
import ProvidingList from './providerindex';
import A_F_Rent from './ask_for_rent';
import Example from './categorymodal';
import FootTab from '../shared/bottom_tab'
import BottomTab from "../shared/bottom_tab";
IconM.loadFont();

var BUTTONS = ["제공 글쓰기", "대여요청 글쓰기", "취소"];
var CANCEL_INDEX = 2;

class PostListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token : ""
    };
  }

  makePostShowRequest(){
    api
      .then((response) =>{
        console.log(response);
        AsyncStorage.getItem('token')
          .then(() => console.log("async store completed!", AsyncStorage.getItem("token")))
          .catch((err) => console.log("err : ", err))
        this.props.navigation.navigate('PostShow');
      })
  }

  render () {
    return(
      <View style = {{flex : 1, backgroundColor : 'white'}}>
        <View style = {{flex : 1}} >
          <Search_Bar navigation = {this.props.navigation}></Search_Bar>
        </View>
        <BottomTab navigation = {this.props.navigation}></BottomTab>
      </View>
    );
  }
}

export default PostListScreen;