// AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import KuchniaPage from './KuchniaPage';
import ZarzadzaniePage from './ZarzadzaniePage';  // Добавлено новое импортирование
import Restauracja from './Restauracja';
import Kategorie from './Kategorie';


const Stack = createStackNavigator();


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="KuchniaPage" component={KuchniaPage} />
        <Stack.Screen name="ZarzadzaniePage" component={ZarzadzaniePage} />  
        <Stack.Screen name="Restauracja" component={Restauracja} />  
        <Stack.Screen name="Kategorie" component={Kategorie} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default createAppContainer(AppNavigator);
