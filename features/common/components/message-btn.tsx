import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import { ClockFading, Mail } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { colors } from '~/constants/Colors';
import { useUnreadMessageCount } from '~/features/common/hook/use-unread-message-count';

type Props = {
  isProcessor?: boolean;
  workspaceId?: string;
};
export const MessageBtn = ({ isProcessor, workspaceId }: Props) => {
  const count = useUnreadMessageCount();
  const onPress = () => {
    if (isProcessor) {
      router.push(
        `/processor-activities?processor=${isProcessor ? 'processor' : ''}&id=${isProcessor ? '' : workspaceId}`,
      );
    } else {
      router.push(`/activities?id=${workspaceId}`);
    }
  };

  return (
    <HStack gap={5} alignItems="center">
      <CustomPressable onPress={() => router.push('/message')}>
        <Mail color={colors.grayText} />
        {count > 0 && (
          <View style={styles.con}>
            <Text style={styles.count}>{count}</Text>
          </View>
        )}
      </CustomPressable>
      <CustomPressable onPress={onPress}>
        <ClockFading color={colors.grayText} />
      </CustomPressable>
    </HStack>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.closeTextColor,
    position: 'absolute',
    top: -3,
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
