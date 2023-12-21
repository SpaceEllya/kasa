//AppNavigator.js
import { createAppContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './LoginPage';
import KuchniaPage from './KuchniaPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="KuchniaPage" component={KuchniaPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default createAppContainer(AppNavigator);