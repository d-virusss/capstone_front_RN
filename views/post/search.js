
<View style = {{flex : 3, alignItems : 'center', }}>
          <View style = {{width : '95%', height : '30%', marginTop : '2%'}}>
            <Search_Bar style={{width : '100%',}}></Search_Bar>
          </View>
          <View style = {{width : '90%', height : '35%', flexDirection : 'row',}}>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', justifyContent : 'center'}}>
              <IconM name = 'dishwasher' size = {60}/>
              <Text style = {{color : '#000'}}>가전</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'tent' size = {60}/>
              <Text style = {{color : '#000'}}>캠핑</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'fish' size = {60}/>
              <Text style = {{color : '#000'}}>낚시</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'bread-slice' size = {60}/>
              <Text style = {{color : '#000'}}>제빵</Text>
            </Button>
          </View>
          <View style = {{width : '90%', height : '35%', flexDirection : 'row'}}>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', justifyContent : 'center'}}>
              <IconM name = 'gamepad-variant-outline' size = {60}/>
              <Text style = {{color : '#000'}}>게임</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'camera' size = {60}/>
              <Text style = {{color : '#000'}}>카메라</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'bike' size = {60}/>
              <Text style = {{color : '#000'}}>자전거</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'tablet-ipad' size = {60}/>
              <Text style = {{color : '#000'}}>패드</Text>
            </Button>
          </View>
      </View>