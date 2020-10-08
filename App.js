import { NavigationContainer } from "@react-navigation/native";
import {View, Text, TextInput} from "react-native";
import React, {Component, Fragment} from "react";
import {createStackNavigator, HeaderBackButton} from "@react-navigation/stack";
import {Button, Icon} from 'native-base';
import LoginScreen from "./views/login/caller";
import RegisterScreen from "./views/registration/caller";
import PostListScreen from "./views/post";
import C_I from './views/post/category_index';
import PostWrite_p from './views/post/postwrite_p';
import PostWrite_c from './views/post/postwrite_c';

const Stack = createStackNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Logins">
          <Stack.Screen name = 'Logins' component = {LoginScreen} options={{headerShown : false}}/>
          <Stack.Screen name = 'Register' component = {RegisterScreen}/>
          <Stack.Screen name = 'PLScreen' component = {PostListScreen} options={
            {
              title : '우만동', 
              headerStyle : {
                backgroundColor : '#EFF3C6', 
                shadowColor : 'gray', 
                shadowRadius : 5,
              },
              headerTitleStyle : {fontSize : 25,},
              headerLeft : null,
              headerRight: () =>(
                <Button
                  onPress={() => alert('This is a button!')}
                  transparent
                >
                  <Icon name = 'search' style={{color : 'black'}}/>
                  <Text>
                    
                  </Text>
                </Button>
              )
              } }/>
          <Stack.Screen name = 'C_index' component = {C_I}/>
          <Stack.Screen name = 'P_W_p' component = {PostWrite_p} options={
            {headerTitle : '대여글 쓰기', headerTitleStyle : {fontSize : 25}}}/>
            <Stack.Screen name = 'P_W_c' component = {PostWrite_c} options={
            {headerTitle : '대여요청글 쓰기', headerTitleStyle : {fontSize : 25}}}/>
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  
};

export default App;