import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, Text, ScrollView } from 'native-base';
import { SliderBox } from "react-native-image-slider-box";
import _ from 'lodash'
IconM.loadFont();

const windowHeight = Dimensions.get('window').height;
class ImageSelect extends Component{
  constructor(props){
    super(props)
    this.state={
      image : this.props.existing_image===undefined ? "" : this.props.existing_image,
      images: [
      ],
      isImage : false,
    }
  }

  doPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      multiple: true,
      sortOrder : 'desc',
      maxFiles : 5,
      compressImageQuality : 0.1,
      
    }).then(images => {
      this.state.images = []
      _.each(images, (image) => {
        this.state.images.push(`${image.sourceURL}`)
      })
      this.setState({ isImage: true })
      this.props.stateBus(images)
    });
  }

  testpress(){
    console.log('pressed')
  }

  render(){
    return(
      <View>
        <SliderBox images={this.state.images}
          onCurrentImagePressed={ () => this.doPickImage() }
          sliderBoxHeight={300}
          inactiveDotColor="#ffccdd"
          dotColor="#ff3377" />
        <TouchableOpacity style={styles.imageArea}
          onPress = { () => this.doPickImage() } >
          {this.state.isImage == false && (
            <IconM name = 'image-multiple' size = {100}/>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageArea: {
    width: '70%',
    alignItems: 'center',
    alignSelf : 'center',
    marginTop : '3%'
  }, 
  wrapper : {
  },
  slide: {
    flex: 1,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
})

export default ImageSelect;