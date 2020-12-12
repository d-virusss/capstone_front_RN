import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView, View, TextInput, Dimensions} from 'react-native';
import api from '../shared/server_address';
import {CardItem, Card, Container, Content, Left, Header, Body, Title, Icon, Right} from 'native-base';


var id, title;
//1 : 개인정보 2 : 서비스 3 : 위치기반
var sub_addr = ["privacy", "tos", "location"];
var addr;


class PolicyDetailScreen extends Component{

	state = {
		content : '',
	}

	showDetail(){
		api.get(addr)
		.then((res) => {
			this.setState({content : res.data.body});
		
		})
		.catch((err) => {
			console.log(err.response.data.error)
		})
	}
	componentDidMount(){
		this.showDetail();
	}

	render(){
		id = this.props.route.params.id;
		title = this.props.route.params.title;
		addr = "/pages/" + sub_addr[id];
		
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
						<Body><Title style={{color:'black',alignSelf:'center'}}>{title}</Title></Body>
						<Right/>
				</Header>

			
				<Content style={{padding : 20}}>
					<Card>
						<ScrollView>
							<Body>
								<View style={styles.textareaContainer}>
								<TextInput multiline={true} numberOfLines={10}
												style={styles.textarea}
												value={this.state.content}
												editable={false}/>
								</View>
							</Body>
						</ScrollView>
					</Card>
			
				</Content>
				
		</Container>
		)
	}
}

let {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
	textarea : {
    height: height*0.75,
    
	},
	textareaContainer : {
    borderColor: '#dddddd',
    borderRadius : 3,
    borderWidth: 1,
    padding: 10,
    width : '100%',
  },
});

export default PolicyDetailScreen;
