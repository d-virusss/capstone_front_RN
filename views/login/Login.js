import React, {Component, Fragment} from "react";
import { 
  StyleSheet,
  Text,
  View,
  StatusBar, TextInput, Button
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Content, Form, Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();


class LoginScreen extends Component {
  render(){
    return (
      <View style = {{flex : 1, justifyCotent : 'center', alignItems : 'center',}}>
        <View style = {{flex : 1}}></View>
        <View style = {{flex : 3}}>
            <Text style = {{color : 'black', fontSize : 40, marginBottom : '35%', textAlign : 'center'
  }}>모두나눔</Text>
          <View style = {{flexDirection : 'row', height : '8%',}}>
            <Icon name="ios-person-outline" size={30} color="black" style={{marginRight : '4%', marginTop: '3%'}}></Icon>
            <Content>
              <Form>
                <Item last>
                  <Input style = {{fontSize : 25, }} placeholder="Username"/>
                </Item>
              </Form>
            </Content>
          </View>
          <View style = {{flexDirection : 'row', height : '8%'}}>
            <Icon name = 'key' size = {30} color = 'black' style = {{marginRight : '4%', marginTop : '3%'}}></Icon>
            <Content>
              <Form>
                <Item last>
                  <Input style = {{fontSize : 25, }} placeholder="Password"/>
                </Item>
              </Form>
            </Content>
          </View>
          <View style = {{marginTop : '5%', height :'8%'}} >
            <CustomButton
              title = "로그인"
              titleColor = "#fff"
              buttonColor = "#0018C6"
              borderRadius = {0}
              width = '100%'
              height = '100%'
              onPress={() => this.props.navigation.navigate('Select')}
            />
          </View>
          <View style = {{marginTop : '3%', height : '5%'}} >
            <CustomButton
              title = "회원가입"
              titleColor = "#fff"
              buttonColor = "#64b5f6"
              width = '100%'
              height = '100%'
              onPress={() => this.props.navigation.navigate('Select')}
            />
          </View>
          <View style = {{alignItems : 'center', width : '100%', height : '5%'}}>
            <View style = {{marginTop : 10, flexDirection : 'row',}} >
              <CustomButton
                title = "ID찾기"
                titleColor = "#fff"
                buttonColor = "#C8C8C8"
                width = '40%'
                height = '100%'
                fontSize = {15}
                onPress={() => this.props.navigation.navigate('Select')}
              />
              <CustomButton
                title = "PW찾기"
                titleColor = "#fff"
                buttonColor = "#C8C8C8"
                width = '40%'
                height = '100%'
                fontSize = {15}
                onPress={() => this.props.navigation.navigate('Select')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default LoginScreen;