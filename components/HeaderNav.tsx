import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleProp, useColorScheme, View, ViewStyle } from 'react-native';

import { MyText } from './Ui/MyText';
import VStack from './Ui/VStack';

import { ReactNode } from 'react';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import Colors, { colors } from '~/constants/Colors';
import { ThemedView } from './Ui/themed-view';

type Props = {
  title: string;
  rightComponent?: ReactNode;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
};

export const HeaderNav = ({
  title,
  rightComponent,
  subTitle,
  style,
}: Props): JSX.Element => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;

  const onGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };
  return (
    <ThemedView
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',

          alignItems: 'center',
          paddingRight: 2,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <CustomPressable
          onPress={onGoBack}
          style={{
            paddingVertical: 5,
            paddingRight: 5,
          }}
        >
          <FontAwesome name="angle-left" color={color} size={30} />
        </CustomPressable>
        <VStack>
          <MyText
            poppins="Bold"
            style={{
              fontSize: 20,
            }}
          >
            {title}
          </MyText>

          {subTitle && (
            <MyText
              poppins="Medium"
              style={{
                color: colors.grayText,

                fontSize: 12,
                marginTop: -8,
              }}
            >
              {subTitle}
            </MyText>
          )}
        </VStack>
      </View>

      {rightComponent}
    </ThemedView>
  );
};
