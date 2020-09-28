import 'react-native-gesture-handler';
import * as React from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './views/registration/caller';

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Seonoh Home Screen</Text>
      <Button
        title="Go detail screen"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈화면 타이틀!!'}}
          initialParams={{itemId: 42}}
        />
        <Stack.Screen name="Details" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
