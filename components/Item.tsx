import { parse } from 'date-fns';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { HStack } from './HStack';
import { MyText } from './Ui/MyText';
import VStack from './Ui/VStack';

import { Avatar } from '~/components/Ui/Avatar';
import { colors } from '~/constants/Colors';
import { Connection } from '~/constants/types';
import { checkIfOpen, formatDateToNowHelper } from '~/lib/helper';
import { toast } from 'sonner-native';

export const Item = (item: Connection & { isLastItemOnList?: boolean }) => {
  const router = useRouter();
  if (!item.organisation) return null;

  const isOpen = checkIfOpen(
    item?.organisation?.start,
    item?.organisation?.end,
  );

  const startChannel = async () => {
    if (!isOpen) {
      toast.info('Organization is closed', {
        description: 'Please try again later during the opening hours',
      });
      return;
    }
    router.push(`/reception/${item?.organisation?._id}`);
  };
  const parsedDate = parse(
    item.connectedAt,
    'dd/MM/yyyy, HH:mm:ss',
    new Date(),
  );
  return (
    <Pressable
      onPress={startChannel}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.3 }]}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={7} alignItems="center">
          <Avatar image={item?.organisation?.avatar!} width={50} height={50} />

          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              {item?.organisation?.name}
            </MyText>
            {isOpen ? (
              <View
                style={{
                  backgroundColor: colors.openTextColor,
                  width: 45,
                  borderRadius: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MyText
                  poppins="Medium"
                  style={{ color: colors.openBackgroundColor }}
                  fontSize={10}
                >
                  Open
                </MyText>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.closeBackgroundColor,
                  width: 45,
                  borderRadius: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MyText
                  style={{ color: colors.closeTextColor }}
                  poppins="Medium"
                  fontSize={10}
                >
                  Closed
                </MyText>
              </View>
            )}
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Time
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            {formatDateToNowHelper(parsedDate)} ago
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 20,
    paddingRight: 5,
  },
});
