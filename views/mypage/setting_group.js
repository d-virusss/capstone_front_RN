import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, View, Alert,
	TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Text, Form, Item, Input, Label, Left, Right, Icon, Body, Title, Button } from 'native-base';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
import { from } from 'form-data';
import { FIX_SHIFT } from 'react-native-popover-view/dist/Constants';
import { ThemeProvider } from '@react-navigation/native';
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
		Alert.alert("코드 전송 완료", "이메일을 확인해주세요.",[{text:'확인', style:'cancel'}])
		this.setState({auth: true});
	})
	.catch((err) =>  {
		Alert.alert("코드 전송 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
	});
}

showAuthForm () {
	if(this.state.auth ==  false){
		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView>
					<Item floatingLabel>
						<Label>인증할 이메일을 입력하세요</Label>
						<Input autoCapitalize="none"
						keyboardType = "email-address"
						autoCapitalize="none"
						onChangeText = {(eMail) => {this.state.user.email = eMail}}/>
					</Item>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		)
	}
	else if(this.state.auth == true){
		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView>
					<Item floatingLabel>
						<Label>인증할 이메일을 입력하세요</Label>
						<Input autoCapitalize="none"
						keyboardType = "email-address"
						autoCapitalize="none"
						value = {this.state.user.email}
						disabled="disabled"/>
					</Item>
					<Item floatingLabel>
						<Label>인증번호</Label>
						<Input
						autoCapitalize="none"
						keyboardType="numeric"
						onChangeText = {(code) => {this.state.user.code = code}}/>
					</Item>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		)
	}else{
		return null;
	}
}

showRequestButton() {
	if(this.state.auth == false){
		return(
			<View style={styles.footer}>
				<Button transparent style={styles.footerbutton} onPress={() => this.getAuthCodeRequest()}>
					<Text style={styles.footerText}> 인증코드 발급 받기</Text>
				</Button>
			</View>
		)
	}else if(this.state.auth == true){
		return(
			<View style={styles.footer}>
				<Button transparent style={styles.footerbutton} onPress={() => this.sendAuthCodeRequest()}>
					<Text style={styles.footerText}> 인증하기</Text>
				</Button>
			</View>
		)
	}
}

sendAuthCodeRequest = async() => {
	if(this.state.user.code){
		api
		.post('/users/email_auth', this.state, {
			headers: {
			'Authorization': this.state.token
			}
		})
		.then((res) =>  {
			Alert.alert("인증 성공", "정상적으로 등록됐습니다.",[{text:'확인', onPress : () => this.props.navigation.goBack()}, {style:'cancel'}])
		})
		.catch((err) =>  {
			Alert.alert("인증 실패", err.response.data.error ,[{text:'확인', style:'cancel'}])
		});
	}else{
		Alert.alert("인증 실패", "인증번호를 입력해주세요." ,[{text:'확인', style:'cancel'}])
	}

}

	render() {
		this.getToken();
			return (
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView>
				<Container>
					<Header style={{
						height: 60,
						backgroundColor: '#f8f8f8',
						justifyContent:'space-between'}}
						androidStatusBarColor='#000'>
						<Left>
						<TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
							<Icon name = 'chevron-back' type = 'Ionicons'/>
						</TouchableOpacity>
						</Left>
						<Body><Title style={{color:'black', alignSelf:'center'}}>소속 인증</Title></Body>
						<Right></Right>
					</Header>

					<Form>
					{this.showAuthForm()}
					</Form>
					{this.showRequestButton()}
				</Container>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	footer: {
		position: 'absolute',
		flex:0.1,
		left: 0,
		right: 0,
		bottom: -5,
		backgroundColor:'#ff3377',
		flexDirection:'row',
		height:80,
		alignItems:'center',
		paddingTop: 7
	  },
	  footerbutton: {
		alignItems:'center',
		justifyContent: 'center',
		flex:1,
	  },
	  footerText: {
		color:'white',
		fontWeight:'bold',
		alignItems:'center',
		fontSize: 20,
	  },
})

export default SettingGroupScreen;
