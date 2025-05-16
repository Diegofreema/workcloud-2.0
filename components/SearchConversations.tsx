import { FlatList } from 'react-native';

import { SearchConversation } from '~/components/SearchConversation';
import { Container } from '~/components/Ui/Container';
import { User } from '~/constants/types';

type Props = {
  users: User[];
};
export const SearchConversations = ({ users }: Props) => {
  return (
    <Container>
      <FlatList
        data={users}
        renderItem={({ item }) => <SearchConversation user={item} />}
        contentContainerStyle={{ gap: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
      />
    </Container>
  );
};
