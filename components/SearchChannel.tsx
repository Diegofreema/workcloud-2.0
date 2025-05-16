import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Channel, ChannelMemberAPIResponse } from 'stream-chat';
import { Skeleton } from 'stream-chat-expo';

import { AvatarPile } from '~/components/AvatarPile';
import { EmptyText } from '~/components/EmptyText';
import { SearchHeader } from '~/components/SearchHeader';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';

type Props = {
  filterChannels: Channel[];
  handleChange: (text: string) => void;
  onPress: (channel: Channel) => void;
  query: string;
  onClear: () => void;
  loading: boolean;
};
export const SearchChannel = ({
  filterChannels,
  handleChange,
  onPress,
  query,
  onClear,
  loading,
}: Props) => {
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Container>
      <SearchHeader
        placeholder="Search by name"
        handleChange={handleChange}
        query={query}
        onClear={onClear}
        back
      />
      <FlatList
        data={filterChannels}
        renderItem={({ item }) => <CustomMessage channel={item} onPress={onPress} />}
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        ListEmptyComponent={query ? <EmptyText text="No user found" /> : null}
      />
    </Container>
  );
};

const CustomMessage = ({
  channel,
  onPress,
}: {
  channel: Channel;
  onPress: (channel: Channel) => void;
}) => {
  const [member, setMember] = useState<ChannelMemberAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  useEffect(() => {
    if (!channel) return;
    setLoading(true);
    try {
      const fetchOtherMembers = async () => {
        const members = await channel.queryMembers({});
        setMember(members);
      };
      // eslint-disable-next-line no-void
      void fetchOtherMembers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [channel]);
  const otherMember = member?.members.filter((m) => m?.user?.id !== id) || [];
  const images = (otherMember?.map((i) => i?.user?.image) as string[]) || [];

  if (loading || !member) {
    return <Skeleton />;
  }
  return (
    <TouchableOpacity onPress={() => onPress(channel)} style={styles.container}>
      <AvatarPile avatars={images} />
      <View>
        <MyText poppins="Bold" fontSize={RFPercentage(1.5)}>
          {channel.data?.name || otherMember[0]?.user?.name}
        </MyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
