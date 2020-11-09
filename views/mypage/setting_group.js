import React, {Component} from 'react';
import { StyleSheet, Platform, View, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import api from '../shared/server_address'

class SettingGroupScreen extends Component {
state = {
    user : {
        email:'',
        code : '',
    },
    token:'',
    auth : false,
}

getToken = async() => {
    let token = await AsyncStorage.getItem('token')
    this.setState({token: token})
}

getAuthCodeRequest = async() => {
    this.getToken().then(() => {
    api
        .post('/users/email_auth', this.state, {
            headers: {
            'Authorization': this.state.token
            }
        })
        .then((res) =>  {
            console.log('success getAuthCodeRequest');
            alert("인증번호를 보냈습니다.")
            this.setState({auth: true});
        })
        .catch((err) =>  {
            console.log('fail getAuthCodeRequest');
            alert("이메일을 다시 확인해주세요.")
        });
    })

}

sendAuthCodeRequest = async() => {
    
api
    .post('/users/email_auth', this.state, {
        headers: {
        'Authorization': this.state.token
        }
    })
    .then((res) =>  {
        console.log('success sendAuthCodeRequest ');
        alert("인증에 성공했습니다.")
        this.setState({auth: true});
    })
    .catch((err) =>  {
        console.log('fail sendAuthCodeRequest ');
        alert("인증번호를 다시 확인해주세요.")
    });

}

render() {
return (
    <Container>
        <Content>
            <Form>
            {/* email */}
            <Item floatingLabel>
            <Label>인증할 이메일을 입력하세요</Label>
            <Input
            onChangeText = {(eMail) => {
                this.state.user.email = eMail
                }}
            />
            </Item>
            <Button
            info
            onPress={() => {this.getAuthCodeRequest();}}>
            <Text>소속 인증하기</Text>
            </Button>

            <Item floatingLabel>
            <Label>인증번호</Label>
            <Input
            onChangeText = {(code) => {
                this.state.user.code = code
                }}
            />
            </Item>
            <Button
            info
            onPress={() => {this.sendAuthCodeRequest();}}>
            <Text>확인</Text>
            </Button>
            </Form>
        </Content>
    </Container>
);
}
}

export default SettingGroupScreen;
