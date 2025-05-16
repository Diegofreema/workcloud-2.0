import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@rneui/themed';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useChatContext } from 'stream-chat-expo';
import { UnreadCount } from '~/components/Unread';
import { fontFamily } from '~/constants';
import { colors } from '~/constants/Colors';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';

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

  const { id, isLoading } = useGetUserId();
  const [unreadCount, setUnreadCount] = useState(0);
  const { client } = useChatContext();
  useEffect(() => {
    if (client || id || !isLoading) {
      // const getUnreadCount = async () => {
      //   const response = await client.getUnreadCount(id);
      //   setUnreadCount(response.total_unread_count);
      // };
      // getUnreadCount();
      client.on((event) => {
        if (event.total_unread_count !== undefined) {
          setUnreadCount(event.total_unread_count);
        }
      });
    }
  }, [client, isLoading, id]);

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
              <View>
                <TabBarIcon
                  name="envelope"
                  color={focused ? colors.buttonBlue : colors.grayText}
                  size={size}
                />
                {unreadCount > 0 ? (
                  <UnreadCount
                    unread={unreadCount}
                    style={{ position: 'absolute', top: -5, right: -8 }}
                  />
                ) : null}
              </View>
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
