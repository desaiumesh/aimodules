import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DrawerContent from './components/DrawerContent';
import HomeAIScreen from './screens/HomeAIScreen';
import TextAIScreen from './screens/TextAIScreen';
import SpeechAIScreen from './screens/SpeechAIScreen';
import { appStyles } from './styles/appStyle';


function App(): JSX.Element {

  const Drawer = createDrawerNavigator();

  return (
   <NavigationContainer>
     <Drawer.Navigator drawerContent={() => <DrawerContent/>}
      screenOptions={
        {
          headerStyle: { borderColor: '#7F7F7F', backgroundColor: '#3F4FAF', borderWidth: 2 },
          headerTintColor: 'white'
        }}
      >
       <Drawer.Screen name="Home" component={HomeAIScreen} />
       <Drawer.Screen name="Text" component={TextAIScreen} />
       <Drawer.Screen name="Speech" component={SpeechAIScreen} />
     </Drawer.Navigator>
   </NavigationContainer>
  );
}



export default App;
