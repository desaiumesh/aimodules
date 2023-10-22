import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeAIScreen from './screens/HomeAIScreen';


function App(): JSX.Element {

  const Drawer = createDrawerNavigator();

  return (
   <NavigationContainer>
     <Drawer.Navigator>
       <Drawer.Screen name="Home" component={HomeAIScreen} />
     </Drawer.Navigator>
   </NavigationContainer>
  );
}



export default App;
