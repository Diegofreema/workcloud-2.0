/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EvilIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyText } from '~/components/EmptyText';
import { HeaderNav } from '~/components/HeaderNav';
import { Item } from '~/components/Item';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { defaultStyle } from '~/constants';
import { api } from '~/convex/_generated/api';
import { useTheme } from '~/hooks/use-theme';

const Connections = () => {
  const { theme: darkMode } = useTheme();

  const connections = useQuery(api.connection.getUserConnections, {});

  if (!connections) {
    return <LoadingComponent />;
  }

  // @ts-ignore
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
        ...defaultStyle,
      }}
    >
      <HeaderNav title="All Connections" rightComponent={<SearchComponent />} />
      <FlatList
        contentContainerStyle={{
          gap: 15,
          paddingBottom: 50,
        }}
        data={connections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;
          // @ts-ignore
          return <Item {...item} isLastItemOnList={isLastItemOnList} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyText text="No Connections yet" />;
        }}
      />
    </View>
  );
};

const SearchComponent = () => {
  const { theme: darkMode } = useTheme();
  return (
    <EvilIcons
      name="search"
      color={darkMode === 'dark' ? 'white' : 'black'}
      size={24}
    />
  );
};
export default Connections;
