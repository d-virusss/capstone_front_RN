import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, View, Alert,
	TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Text, Form, Item, Input, Label, Left, Right, 
	Icon, Body, Title, Button } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address'
import IconM from 'react-native-vector-icons/Ionicons'
import FormData from 'form-data';
import { FIX_SHIFT } from 'react-native-popover-view/dist/Constants';
import { ThemeProvider } from '@react-navigation/native';
IconM.loadFont()

var formdata = new FormData();
class SettingGroupScreen extends Component {
state = {
	user : {
		email:'',
		code : '',
	},
	email : '',
	code : '',
	token:'',
	auth : false,
	loading : false,
}

componentDidMount(){
	console.log(this.state)
}
getToken = async() => {
	let token = await AsyncStorage.getItem('token')
	this.state.token = token
}

getAuthCodeRequest = async() => {
	this.state.user.email = this.state.email
	this.setState({ loading: true })
	api
	.post('/users/email_auth', this.state, {
		headers: {
		'Authorization': this.state.token
		}
	})
	.then((res) =>  {
		this.state.auth = true,
		Alert.alert("코드 전송 완료", "이메일을 확인해주세요.",[{text:'확인', style:'cancel', onPress: () => {this.setState({loading:false})}}])
	})
	.catch((err) =>  {
		Alert.alert("코드 전송 실패", err.response.data.error,[{text:'확인', style:'cancel', onPress: () => {this.setState({ loading : false })} }])
	});
}

is_there_input(input){
	if(input !== '') return true
	else return false
}

renderTransferButton(){
	if(this.is_there_input(this.state.email)){
		return(
			<Button style={{ backgroundColor: '#ff3377', marginTop: '5%', marginLeft: '5%' }} 
				onPress={() => this.getAuthCodeRequest()}>
				<Text style={{ color: 'white', fontWeight: 'bold' }}>전송</Text>
			</Button>
		)
	}
	else{
		return(
			<Button bordered style={{ borderColor: '#aaaaaa', marginTop: '5%', marginLeft: '5%' }} disabled>
				<Text style={{ color: '#aaaaaa', fontWeight: 'bold' }}>전송</Text>
			</Button>
		)
	}
}

renderCertifyButton(){
	if (this.is_there_input(this.state.code)) {
		return (
			<Button style={{ backgroundColor: '#ff3377', marginTop: '5%', marginLeft: '5%' }}
				onPress={() => this.sendAuthCodeRequest()}>
				<Text style={{ color: 'white', fontWeight: 'bold' }}>인증</Text>
			</Button>
		)
	}
	else{
		return (
			<Button bordered style={{ borderColor: '#aaaaaa', marginTop: '5%', marginLeft: '5%' }} disabled>
				<Text style={{ color: '#aaaaaa', fontWeight:'bold' }}>인증</Text>
			</Button>
		)
	}
}

showAuthForm () {
	if(this.state.auth ==  false){
		return (
		<Form>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView>
					<View style={{ flexDirection: 'row' }}>
						<Item floatingLabel style={{ width: '75%' }}>
							<Label>인증할 이메일을 입력하세요</Label>
							<Input autoCapitalize="none" 
								keyboardType = "email-address"
								onChangeText = {(eMail) => {this.setState({ email : eMail }) }}/>
						</Item>
						{this.renderTransferButton()}
					</View>
					
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</Form>
		)
	}
	else if(this.state.auth == true){
		return (
			<Form>
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
					<KeyboardAvoidingView>
						<View style={{ flexDirection: 'row' }}>
							<Item floatingLabel style={{ width: '75%'}}>
								<Label>인증할 이메일을 입력하세요</Label>
								<Input
									value = {this.state.user.email}
									disabled="disabled"/>
							</Item>
							<Button bordered style={{ borderColor: '#aaaaaa', marginTop: '5%', marginLeft: '5%' }} disabled>
								<Text style={{ color: '#aaaaaa' }}>전송</Text>
							</Button>
						</View>
						</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
					<KeyboardAvoidingView>
						
						<View style={{ flexDirection: 'row' }}>
							<Item floatingLabel style={{ width: '75%' }}>
								<Label>인증번호</Label>
								<Input
									autoCapitalize="none"
									keyboardType="numeric"
									onChangeText = {(code) => {this.setState({ code : code } )}}/>
							</Item>
							{this.renderCertifyButton()}
						</View>
						</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</Form>
				
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
	if(this.state.code){
		this.state.user.code = this.state.code
		this.setState({ loading: true })
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
			Alert.alert("인증 실패", err.response.data.error ,[{text:'확인', style:'cancel', onPress: ()  => {this.setState({loading:false})}}])
		});
	}

}

render() {
	this.getToken();
		return (
		
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
				<Spinner visible={this.state.loading} color="#ff3377"></Spinner>
				
				{this.showAuthForm()}
			</Container>
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
