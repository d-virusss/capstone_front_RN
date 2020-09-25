import React, {Component, Fragment} from "react";
import { 
  StyleSheet,
  Text,
  View,
  StatusBar, TextInput, Button
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

const LoginScreen = ({navigation}) => {
    return (
      <View style = {{flex : 1, justifyCotent : 'center', alignItems : 'center'}}>
        <View style = {{flex : 1}}></View>
        <View style = {{flex : 3}}>
            <Text style = {{color : 'black', fontSize : 40, marginBottom : 150, textAlign : 'center'
  }}>모두나눔</Text>
        <View style = {{flexDirection : 'row'}}>
          <Icon name="ios-person-outline" size={30} color="black" style={{marginRight : 15}}></Icon>
          <TextInput style = {{fontSize : 25}} placeholder="ID를 입력해주세요"/>
        </View>
        <View style = {{flexDirection : 'row'}}>
          <Text style = {{marginRight : 10}}>PW</Text>
          <TextInput placeholder="PW를 입력해주세요"/>
        </View>
        <View
              style = {{marginTop : 30}} >
          <Button
            title = "회원가입"
            titleColor = "#fff"
            buttonColor = "#64b5f6"
            border = "20"
            onPress={() => navigation.navigate('Select')}
          />
        </View>
        </View>
      </View>
    );
}

export default LoginScreen;