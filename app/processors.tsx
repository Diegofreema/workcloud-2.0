import { usePaginatedQuery, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { ChatPreviewSkeleton } from '~/components/ChatPreviewSkeleton';
import { Conversations } from '~/components/Conversations';
import { HeaderNav } from '~/components/HeaderNav';
import { NewBtn } from '~/components/NewGroup';
import { Container } from '~/components/Ui/Container';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useGetUserId } from '~/hooks/useGetUserId';

const Processors = () => {
  const { orgId } = useLocalSearchParams<{ orgId: Id<'organizations'> }>();
  const { id } = useGetUserId();
  const organisation = useQuery(api.organisation.getOrganisationById, { organisationId: orgId });
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.conversation.getConversations,
    {
      userId: id!,
      type: 'processor',
    },
    { initialNumItems: 20 }
  );

  if (isLoading || !organisation) {
    return <ChatPreviewSkeleton length={15} />;
  }
  const onPress = () => {
    router.push(`/processor-staff?orgId=${orgId}`);
  };
  return (
    <Container noPadding>
      <View style={{ paddingHorizontal: 15 }}>
        <HeaderNav title="Processors" subTitle={organisation?.name} />
      </View>
      <Conversations conversations={results} status={status} loadMore={loadMore} />
      <NewBtn onPress={onPress} />
    </Container>
  );
};
export default Processors;
