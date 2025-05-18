import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@rneui/themed';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { fontFamily } from '~/constants';
import { colors } from '~/constants/Colors';
import { useDarkMode } from '~/hooks/useDarkMode';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { darkMode } = useDarkMode();

  return (
    <>
      <StatusBar
        style={darkMode === 'dark' ? 'light' : 'dark'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: darkMode === 'dark' ? '#151718' : 'white',
          headerShown: false,
          tabBarStyle: {
            height: 50,
            paddingBottom: 5,
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="home"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="envelope"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Messages
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="organization"
          options={{
            title: 'Organizations',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="briefcase"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Organizations
              </Text>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
