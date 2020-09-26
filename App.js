import { NavigationContainer } from "@react-navigation/native";
import {View, Text, TextInput, Button} from "react-native";
import React, {Component, Fragment} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "./views/login/caller";
import Register_s from "./register/Register_s";
import Register_norm from "./register/Register_norm";
import Register_com from "./register/Register_com";

const Stack = createStackNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName = "Logins">
          <Stack.Screen name = 'Logins' component = {LoginScreen} options={{headerShown : false}}/>
          <Stack.Screen name = 'Select' component = {Register_s}/>
          <Stack.Screen name = 'Rnorm' component = {Register_norm}/>
          <Stack.Screen name = 'Rcom' component = {Register_com}/>
        </Stack.Navigator>
      </NavigationContainer>
      
     
      //<LoginScreen></LoginScreen>
     
    );
  
};

export default App;