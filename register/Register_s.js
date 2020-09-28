import { NavigationContainer } from "@react-navigation/native";
import React, {Component, Fragment} from "react";
import { 
  StyleSheet,
  Text,
  View,
  StatusBar, TextInput, Button
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

class Register_s extends Component{
    render() {
        return (
            <View style = {{flex : 1, justifyContent : 'center', alignItems : 'center', flexDirection : 'row'}}>
                <Button
                title = "일반회원가입"
                titleColor = "#fff"
                buttonColor = "#64b5f6"
                border = "20"
                onPress = {() => this.props.navigation.navigate('Rnorm')}
                />
                <Button
                title = "사업자회원가입"
                titleColor = "#fff"
                buttonColor = "#64b5f6"
                border = "20"
                onPress = {() => this.props.navigation.navigate('Rcom')}
                />
            </View>
        );
    };
}
export default Register_s;