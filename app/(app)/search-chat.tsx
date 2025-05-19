import { useQuery } from 'convex/react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { SearchComponent } from '~/features/common/components/SearchComponent';
import { SearchConversations } from '~/components/SearchConversations';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';

const SearchChat = () => {
  const [value, setValue] = useState('');
  const [query] = useDebounce(value, 500);
  const { id } = useGetUserId();
  const users = useQuery(api.conversation.searchConversations, {
    query,
    loggedInUserId: id!,
  });

  const loading = query !== '' && users === undefined;

  // @ts-ignore
  const Component = loading ? <LoadingComponent /> : <SearchConversations users={users! || []} />;

  return (
    <Container noPadding>
      <SearchComponent
        customStyles={{ paddingHorizontal: 10 }}
        placeholder="Search by name"
        value={value}
        setValue={setValue}
      />
      {Component}
    </Container>
  );
};

export default SearchChat;
