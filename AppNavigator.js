import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';  // Добавлено новое импортирование
import LoginPage from './LoginPage';
import KuchniaPage from './KuchniaPage';
import ZarzadzaniePage from './ZarzadzaniePage';  
import Restauracja from './Restauracja';
import Kategorie from './Kategorie';
import Kuchnia from './Kuchnia';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="KuchniaPage" component={KuchniaPage} />
        <Stack.Screen name="Kuchnia" component={Kuchnia} />
        <Stack.Screen name="ZarzadzaniePage" component={ZarzadzaniePage} />  
        <Stack.Screen name="Restauracja" component={Restauracja} />  
        <Stack.Screen name="Kategorie" component={Kategorie} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default createAppContainer(AppNavigator);
