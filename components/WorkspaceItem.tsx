import { Pressable } from 'react-native';

import { MyText } from './Ui/MyText';

import { FunctionReturnType } from 'convex/server';
import { api } from '~/convex/_generated/api';
import { Avatar } from '~/features/common/components/avatar';

type Props = {
  item: FunctionReturnType<typeof api.organisation.getOrganisationsOrNull>;
  onPress?: () => void;
};

export const WorkspaceItem = ({ item, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      {item?.avatar && <Avatar url={item.avatar!} />}
      <MyText
        poppins="Medium"
        style={{
          fontSize: 12,

          textTransform: 'capitalize',
        }}
      >
        {item?.name}
      </MyText>
    </Pressable>
  );
};
