import { NavigationContainer } from "@react-navigation/native";
import {View, Text, TextInput} from "react-native";
import React, {Component, Fragment} from "react";
import {createStackNavigator, HeaderBackButton} from "@react-navigation/stack";
import {Button, Icon} from 'native-base';
import LoginScreen from "./views/login/caller";
import Register_form from './views/registration/caller';
import FindId from './views/findid/caller';
import FindPw from './views/findpw/caller';
import PostListScreen from "./views/post";
import C_I from './views/post/category_index';
import PostWrite_p from './views/post/postwrite_p';
import PostWrite_c from './views/post/postwrite_c';
import SearchBar from './views/post/search_bar';
import chatIndex from './views/chat/chat_index';

const Stack = createStackNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Logins">
          <Stack.Screen name = 'Logins' component = {LoginScreen} options={{headerShown : false}}/>
          <Stack.Screen name = 'Register' component = {Register_form}/>
          <Stack.Screen name="Find_id" component={FindId} />
          <Stack.Screen name="Find_pw" component={FindPw} />
          <Stack.Screen name = 'PLScreen' component = {PostListScreen} options={{headerShown : false}}/>
          <Stack.Screen name = 'C_index' component = {C_I}/>
          <Stack.Screen name = "Chats" component = {chatIndex}
            options = { {
              title : '채팅',
              headerLeft : null
            } } />
          <Stack.Screen name = 'P_W_p' component = {PostWrite_p} options={
            {headerTitle : '대여글 쓰기', headerTitleStyle : {fontSize : 25}}}/>
          <Stack.Screen name = 'P_W_c' component = {PostWrite_c} options={
            {headerTitle : '대여요청글 쓰기', headerTitleStyle : {fontSize : 25}}}/>
          <Stack.Screen name = 'Seach' component = {SearchBar}/>
        </Stack.Navigator>
      </NavigationContainer>
     
    );
  
};

export default App;
