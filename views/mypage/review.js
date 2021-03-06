import React, {Component} from 'react';
import {Text, TouchableOpacity, Alert, ScrollView, StyleSheet, View, DeviceEventEmitter} from 'react-native';
import {Container, Card, CardItem, Thumbnail, Content,
     Header, Left, Right, Icon, Body, Title, Badge} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import {Rating} from 'react-native-elements'
import IconM from 'react-native-vector-icons/Ionicons'
import { SliderBox } from "react-native-image-slider-box";
import Spinner from 'react-native-loading-spinner-overlay';
IconM.loadFont();

var reviewList = []

class ReviewScreen extends Component {
	state = {
		token : '',
		id : '',
		loading : true,
		images : [],
	}

	onRefresh(){
		console.log("상태 refresh")
		this.setState({loading : true});
		this.getReviewRequest();
	}

	componentDidMount() {
		this.getToken().then(() => {
			this.getReviewRequest();})
		this.eventListener = DeviceEventEmitter.addListener('updateReviewList', this.handleEvent);
	}
	
	componentWillUnmount(){
	//remove listener
	this.eventListener.remove();
	}

	handleEvent = (e) => {
	console.log("updateReviewList event handler")
	this.getReviewRequest()
	}

	getToken = async () => {
		let value = await AsyncStorage.getItem("token")
		let id = await AsyncStorage.getItem("user_id");
		this.state.token = value
		this.state.id = id;
	}

	getReviewRequest(){
		api.get(`/reviews?user_id=${this.state.id}`, {
			headers: {
				Authorization: this.state.token,
			},
		}).then((res)=> {
			console.log("================")
			console.log(res);
			reviewList = res.data;
			
			this.setState({loading : false})
		}).catch((err) => {
			Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
		})
	}

	makeReviewList() {
		console.log(reviewList)
		if(reviewList.length == 0){
			return(
				<Title style={{marginTop : '70%', fontSize : 17}}>작성한 리뷰가 없습니다.</Title>
			)
		}else{
		return reviewList.map((ele) => {
			return(
				<Card style={{flex: 0, marginTop: '5%'}}>
					<CardItem style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop:'3%'}}>
						<Thumbnail source={ele.review_info.post_image=='/image/default.png' ? require('../../assets/default.png') :{uri: ele.review_info.post_image}} />
							<Body style={{marginLeft : '5%'}}>
								<Title style={{color:'black'}}>{ele.review_info.post_title}</Title>
								<Text> {ele.review_info.created_at}</Text>
							</Body>
							<Right>
								<Rating
									readonly
									fractions={1}
									startingValue={ele.review_info.rating}
									ratingCount={5}
									imageSize={20}/>
							</Right>
					</CardItem>

					<CardItem style={{flex: 1, flexDirection: 'row', paddingTop:'3%'}}>
            <ScrollView >
              <SliderBox style={styles.review_swiper}
              images={ele.review_info.images}
              sliderBoxHeight={200}
              inactiveDotColor="#ffccdd"
              dotColor="#ff3377" />
							<Text>{"\n\n"}{ele.review_info.body}</Text>
							<View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
								<TouchableOpacity style={{ marginRight: '2%' }} onPress = {() =>this.changeReview(ele.review_info)}>
									<Badge style={{ backgroundColor: '#ffe812'}}> 
										<Text style={{color: 'black',fontWeight: 'bold'}}>수정하기</Text> 
									</Badge>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => this.deleteRequest(ele.review_info.id)}>
									<Badge> 
										<Text style={{color: 'white',fontWeight: 'bold'}}>삭제하기</Text> 
									</Badge>
								</TouchableOpacity>
							</View>
            </ScrollView >
          </CardItem>
				</Card>
			);
			console.log("000")
		});
		}
	}
////////////////for delete
	deleteRequest(id) {
		api.delete(`/reviews/${id}`, {
			headers : {
				Authorization : this.state.token
			}
		}).then(()=> {
			this.onRefresh();
			Alert.alert("삭제 완료", "리뷰가 정상적으로 삭제되었습니다.",[{text: '확인',},{style: 'cancel',}]) 
		}).catch((err) => {
			Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}]) 
		})
	}

	changeReview(review) {
		let posts = {
				id :review.booking_id,
				image : review.post_image,
				title : review.post_title,
				rating : review.rating,
				body : review.body,
				review_id : review.id,
				review_images : review.images,
		}//for review request

		this.props.navigation.navigate('UpdateReview', {posts : posts})
	}

  render(){
		if(this.state.loading){
			return(
				<Container>
					<Header />
					<Content>
					<Spinner visible={this.state.loading} color="#ff3377" />
					</Content>
				</Container>
				)
    }else{
      return(
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
						<Body><Title style={{ color: 'black', alignSelf: 'center', fontSize: 20}}>작성한 리뷰</Title></Body>
						<Right>
						</Right>
          </Header>
    
			
					<ScrollView style={{ paddingHorizontal: '3%' }}>
						{this.makeReviewList()}
					</ScrollView>
		
        </Container>
      )
    }
  }
}

const styles = StyleSheet.create({
	review_swiper: {
    width: 200,
    height: 200,
    marginLeft : -60,
    alignSelf: 'center',
	},
})
export default ReviewScreen;