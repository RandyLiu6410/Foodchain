import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import UploadScreen from '../screens/UploadScreen';
import CameraScreen from '../screens/CameraScreen';
import NewItemScreen from '../screens/NewItemScreen';
import EventScreen from '../screens/EventScreen';
import { BottomTabParamList, UploadParamList, EventParamList } from '../types';

import { PhotoContext } from '../services/PhotoContext';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Upload"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Upload"
        component={UploadNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="cloud-upload-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Event"
        component={EventNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="list-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const UploadStack = createStackNavigator<UploadParamList>();

function UploadNavigator() {
  const [context, setContext] = React.useState(null);

  return (
    <PhotoContext.Provider value={[context, setContext]}>
      <UploadStack.Navigator>
        <UploadStack.Screen
          name="UploadScreen"
          component={UploadScreen}
          options={{ headerTitle: 'Upload' }}
        />
        <UploadStack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerTitle: 'Camera' }}
        />
        <UploadStack.Screen
          name="NewItemScreen"
          component={NewItemScreen}
          options={{ headerTitle: 'New Item' }}
        />
      </UploadStack.Navigator>
    </PhotoContext.Provider>
  );
}

const EventStack = createStackNavigator<EventParamList>();

function EventNavigator() {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name="EventScreen"
        component={EventScreen}
        options={{ headerTitle: 'Event' }}
      />
    </EventStack.Navigator>
  );
}
