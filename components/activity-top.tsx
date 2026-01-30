import { HStack } from '~/components/HStack';
import { Avatar } from '~/features/common/components/avatar';
import VStack from '~/components/Ui/VStack';
import { MyText } from '~/components/Ui/MyText';
import Colors, { colors } from '~/constants/Colors';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import {
  CircleCheck,
  Circle,
  PencilLineIcon,
  Trash,
  Trash2,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Doc } from '~/convex/_generated/dataModel';
import { useMessage } from '~/hooks/use-message';

type ActivityTopProps = {
  name: string;
  seen: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isProcessor: boolean;
  image: string;
  status: 'resolved' | 'unresolved';
  message: string;
  onUpdate: () => void;
  updating: boolean;
  owner: Doc<'users'>;
  assignedTo?: Doc<'users'> | null;
};
export const ActivityTop = ({
  seen,
  onEdit,
  onDelete,
  name,
  isProcessor,
  image,
  status,
  message,
  updating,
  onUpdate,
  owner,
  assignedTo,
}: ActivityTopProps) => {
  const text = seen ? 'Seen' : 'Unseen';
  const isResolved = status === 'resolved';
  const color = isResolved
    ? colors.openBackgroundColor
    : seen
      ? colors.buttonBlue
      : colors.grayText;
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const iconColor = Colors[colorScheme ?? 'light'].text;
  const onPress = () => {
    router.push('/starred-identity');
  };
  return (
    <CustomPressable onPress={onPress}>
      <HStack justifyContent={'space-between'} width={'100%'}>
        <HStack gap={15} alignItems={'center'}>
          <View>
            <Avatar url={image} size={60} />
            <SmallAvatar
              isProcessor={isProcessor}
              owner={owner}
              assignedTo={assignedTo}
            />
          </View>
          <VStack>
            <MyText poppins={'Bold'} fontSize={15}>
              {name}
            </MyText>
            <HStack gap={5} alignItems={'center'}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  borderRadius: 100,
                }}
              />
              <MyText poppins={'Light'} style={{ color }} fontSize={15}>
                {isResolved ? 'Resolved' : text}
              </MyText>
            </HStack>
          </VStack>
        </HStack>
        {!isProcessor && (
          <HStack alignItems={'flex-start'} gap={10}>
            <CustomPressable
              onPress={onEdit}
              style={[styles.pressable, { backgroundColor }]}
            >
              <PencilLineIcon color={iconColor} />
            </CustomPressable>
            <CustomPressable
              onPress={onDelete}
              style={[styles.pressable, { backgroundColor }]}
            >
              <Trash2 color={colors.closeTextColor} />
            </CustomPressable>
          </HStack>
        )}
        {isProcessor && (
          <CustomPressable onPress={onUpdate} disable={updating}>
            {isResolved ? (
              <CircleCheck color={iconColor} />
            ) : (
              <Circle color={iconColor} />
            )}
          </CustomPressable>
        )}
      </HStack>
      <MyText poppins={'Medium'} fontSize={12} style={{ lineHeight: 20 }}>
        {message}
      </MyText>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 100,
    padding: 4,
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
  },
  smallAvatar: {
    position: 'absolute',
    right: -13,
    bottom: -10,
  },
  smallAvatarImage: {
    borderWidth: 1,
    borderColor: '#fff',
  },
});

type SmallAvatarProps = {
  isProcessor: boolean;
  owner: Doc<'users'>;
  assignedTo?: Doc<'users'> | null;
};

const SmallAvatar = ({ isProcessor, owner, assignedTo }: SmallAvatarProps) => {
  const { onMessage } = useMessage();
  const onPress = () => {
    onMessage(isProcessor ? owner.userId : assignedTo?.userId!, 'processor');
  };
  const image = isProcessor ? owner.image : assignedTo?.image;
  return (
    <CustomPressable onPress={onPress} style={styles.smallAvatar}>
      <Avatar url={image as string} size={25} style={styles.smallAvatarImage} />
    </CustomPressable>
  );
};
