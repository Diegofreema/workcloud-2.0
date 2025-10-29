import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@rneui/themed';
import { useQuery } from 'convex/react';
import { Tabs } from 'expo-router';
import React from 'react';

import { StyleSheet, View } from 'react-native';
import { fontFamily } from '~/constants';
import Colors, { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { useUnreadMessageCount } from '~/features/common/hook/use-unread-message-count';
import { useColorScheme } from '~/hooks/useColorScheme';

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
  const colorScheme = useColorScheme();
  const count = useUnreadMessageCount();
  const { user } = useAuth();
  const userId = user?._id;
  const missedCall = useQuery(
    api.users.getMissedCalls,
    userId ? { userId } : 'skip'
  );
  const missedCallCount = missedCall === undefined ? 0 : missedCall;
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            height: 50,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
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
          name="message"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="envelope"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <View>
                <Text
                  style={{
                    color: focused ? colors.buttonBlue : colors.grayText,
                    fontFamily: fontFamily.Bold,
                    fontSize: 10,
                  }}
                >
                  Messages
                </Text>
                {count > 0 && (
                  <View style={styles.con}>
                    <Text style={styles.count}>{count}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="organization"
          options={{
            title: 'Organization',
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
                Organization
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="calls"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="phone"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <View>
                <Text
                  style={{
                    color: focused ? colors.buttonBlue : colors.grayText,
                    fontFamily: fontFamily.Bold,
                    fontSize: 10,
                  }}
                >
                  Call log
                </Text>
                {missedCallCount > 0 && (
                  <View style={styles.call}>
                    <Text style={styles.count}>{missedCallCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.lightBlue,
    position: 'absolute',
    top: -30,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: 20,
    height: 20,
  },
  call: {
    backgroundColor: colors.closeTextColor,
    position: 'absolute',
    top: -30,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: 20,
    height: 20,
  },
  count: {
    color: colors.white,
  },
});
