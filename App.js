import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import MemoryScreen from './src/screens/MemoryScreen';

// Import context
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
         headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Memory') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Memory" component={MemoryScreen} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a splash/loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}