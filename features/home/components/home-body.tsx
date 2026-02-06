import { LegendList } from '@legendapp/list';
import { useMutation } from 'convex/react';
import { Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { EmptyText } from '~/components/EmptyText';
import { Item } from '~/components/Item';
import { HeadingText } from '~/components/Ui/HeadingText';
import { colors } from '~/constants/Colors';
import { constantStyles } from '~/constants/styles';
import { api } from '~/convex/_generated/api';
import { generateErrorMessage } from '~/lib/helper';

type Props<T> = {
  headerText: string;
  data: T[];
};

export const HomeBody = <T,>({ data, headerText }: Props<T>) => {
  const deleteConnection = useMutation(api.connection.deleteConnection);

  const [deleting, setDeleting] = useState(false);
  const onAlertDelete = async (item: any) => {
    Alert.alert(
      'Delete Connection',
      'Are you sure you want to delete this connection?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            if (deleting) return;
            setDeleting(true);
            try {
              await deleteConnection({ id: item.id });
              toast.success('Success', {
                description: 'Connection deleted successfully',
              });
            } catch (e) {
              const errorMessage = generateErrorMessage(
                e,
                'Failed to delete connection',
              );
              toast.error('Error', {
                description: errorMessage,
              });
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        ListHeaderComponent={
          <View style={{ marginVertical: 10 }}>
            <HeadingText link="/connections" rightText={headerText} />
          </View>
        }
        contentContainerStyle={constantStyles.contentContainerStyle}
        data={data}
        keyExtractor={(item: any, index) => item.id}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;

          return (
            <ReanimatedSwipeable
              renderRightActions={(p, d) =>
                RightAction(p, d, () => onAlertDelete(item as any))
              }
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
            >
              {/*@ts-ignore*/}
              <Item {...item} isLastItemOnList={isLastItemOnList} />
            </ReanimatedSwipeable>
          );
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyText text="No Connections yet" />;
        }}
        recycleItems
      />
    </View>
  );
};

function RightAction(
  prog: SharedValue<number>,
  dragX: SharedValue<number>,
  onAlertDelete: () => void,
) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dragX.value + 50 }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          backgroundColor: 'red',
          justifyContent: 'center',
          width: 50,
          height: '100%',
        },
        styleAnimation,
      ]}
    >
      <Trash color={colors.white} size={24} onPress={onAlertDelete} />
    </Animated.View>
  );
}
