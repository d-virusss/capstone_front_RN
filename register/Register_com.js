import React, {Component, Fragment} from "react";
import { 
  StyleSheet,
  Text,
  View,
  StatusBar, TextInput, Button
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

class Register_com extends Component{
    render() {
        return (
            <View style = {{flex : 1, alignItems : 'center'}}>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>이메일</Text>
                    <TextInput 
                    placeholder = 'email을 입력하세요'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>비밀번호</Text>
                    <TextInput 
                    placeholder = '비밀번호를 입력하세요'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>확인</Text>
                    <TextInput 
                    placeholder = '비밀번호를 입력하세요'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>동네</Text>
                    <TextInput 
                    placeholder = '지역'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                    <Button
                    title = '지역인증'
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>닉</Text>
                    <TextInput 
                    placeholder = '사업자명을 입력하세요'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>폰</Text>
                    <TextInput 
                    placeholder = '사업자등록번호'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>사업자등록증</Text>
                    <Button
                    title = '업로드'
                    />
                </View>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {{fontSize : 25, padding : 10}}>폰</Text>
                    <TextInput 
                    placeholder = '전화번호를 입력하세요'
                    placeholderTextColor = 'red'
                    style = {{fontSize : 25, padding : 10}}
                    />
                    <Button
                    title = '본인인증'
                    style = {{padding : 10}}
                    />
                </View>
            </View>
        );
    };
}
export default Register_com;