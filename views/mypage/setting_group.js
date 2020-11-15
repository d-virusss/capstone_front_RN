import React, {Component} from 'react';
import { TouchableOpacity, View, Alert} from 'react-native';
import CustomButton from '../login/custom_button';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Form, Item, Input, Label, Left, Right, Icon, Body, Title } from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
IconM.loadFont()

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
    this.state.token = token
}

getAuthCodeRequest = async() => {
    api
    .post('/users/email_auth', this.state, {
        headers: {
        'Authorization': this.state.token
        }
    })
    .then((res) =>  {
        console.log('success getAuthCodeRequest');
        Alert.alert("코드를 발송했습니다", "",[{text:'확인', style:'cancel'}])
        this.setState({auth: true});
    })
    .catch((err) =>  {
        console.log('fail getAuthCodeRequest');
        console.log(err)
        Alert.alert("이메일을 다시 확인해주세요", "",[{text:'확인', style:'cancel'}])
    });
}

showAuthFrom () {
    if(this.state.auth == true){
        return(
        <View>
            <Item floatingLabel>
            <Label>인증번호</Label>
            <Input
            onChangeText = {(code) => {
                this.state.user.code = code
                }}
            />
            </Item>
            <View style={{marginTop: '10%',height: '23%', alignItems: 'center',}}>
                <CustomButton
                    title="소속 인증하기"
                    titleColor="white"
                    buttonColor="skyblue"
                    borderWidth={5}
                    borderRadius={5}
                    width="50%"
                    height="100%"
                    justify='center'
                    onPress={() => this.sendAuthCodeRequest()}
                />
            </View>
        </View>
        )
    }else{
        return null;
    }

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
        Alert.alert("인증되었습니다", "",[{text:'확인', style:'cancel'}])
    })
    .catch((err) =>  {
        console.log('fail sendAuthCodeRequest ');
        Alert.alert("인증 번호를 다시 확인해주세요", "",[{text:'확인', style:'cancel'}])
    });

}

render() {
    this.getToken();
    return (
    <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>소속 인증</Title></Body>
          <Right></Right>
        </Header>

        <Content>
            <Form>
            {/* email */}
            <View>
            <Item floatingLabel>
            <Label>인증할 이메일을 입력하세요</Label>
            <Input autoCapitalize="none"
            onChangeText = {(eMail) => {
                this.state.user.email = eMail
                }}
            />
            </Item>
            <View style={{marginTop: '10%',height: '23%', alignItems: 'center',}}>
                <CustomButton
                    title="인증 코드 발급"
                    titleColor="white"
                    buttonColor="skyblue"
                    borderWidth={5}
                    borderRadius={5}
                    width="50%"
                    height="100%"
                    justify='center'
                    onPress={() => this.getAuthCodeRequest()}
                />
            </View>
            </View>
                {this.showAuthFrom()}
            </Form>
        </Content>
    </Container>
);
}
}

export default SettingGroupScreen;
