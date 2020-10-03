import { NavigationContainer } from "@react-navigation/native";
import {View, Text, TextInput, Button} from "react-native";
import React, {Component, Fragment} from "react";
import {createStackNavigator, HeaderBackButton} from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from "./views/login/caller";
import Register_s from "./register/Register_s";
import Register_norm from "./register/Register_norm";
import Register_com from "./register/Register_com";
import PostListScreen from "./views/post";
import C_I from './views/post/category_index';
import PostWrite_p from './views/post/postwrite_p';

const Stack = createStackNavigator();
const Tabnav = createBottomTabNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Logins">
          <Stack.Screen name = 'Logins' component = {LoginScreen} options={{headerShown : false}}/>
          <Stack.Screen name = 'Select' component = {Register_s}/>
          <Stack.Screen name = 'Rnorm' component = {Register_norm}/>
          <Stack.Screen name = 'Rcom' component = {Register_com}/>
          <Stack.Screen name = 'PLScreen' component = {PostListScreen} options={
            {
              title : '우만동', 
              headerStyle : {
                backgroundColor : '#EFF3C6', 
                shadowColor : 'gray', 
                shadowRadius : 5,
              },
              headerTitleStyle : {fontSize : 25,},
              headerLeft : null
              } }/>
          <Stack.Screen name = 'C_index' component = {C_I}/>
          <Stack.Screen name = 'P_W_p' component = {PostWrite_p} options={
            {headerTitle : '대여글 쓰기', headerTitleStyle : {fontSize : 25}}}/>
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  
};

export default App;