import { Avatar } from '@rneui/themed';
import { useMutation, useQuery } from 'convex/react';
import {
  ErrorBoundaryProps,
  useGlobalSearchParams,
  useRouter,
} from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import { useDebounce } from 'use-debounce';

import { HStack } from '~/components/HStack';
import { TSearch } from '~/components/TopSearch';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { Suggestions } from '~/components/Ui/Suggestions';
import VStack from '~/components/Ui/VStack';
import { SearchServicePoints } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { RenderSuggestions } from '~/features/organization/components/render-suggestions';
import { useGetUserId } from '~/hooks/useGetUserId';

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}

const Search = () => {
  const [value, setValue] = useState('');
  const [val] = useDebounce(value, 500);
  const { query } = useGlobalSearchParams<{ query: string }>();
  const { id } = useGetUserId();
  useEffect(() => {
    setValue(query);
  }, [query]);

  const topSearch = useQuery(api.organisation.getTopSearches, { userId: id! });

  const searchesByServicePointName = useQuery(
    api.organisation.getOrganisationsByServicePointsSearchQueryName,
    {
      query: val,
      ownerId: id!,
    }
  );
  const servicePoints = useQuery(api.organisation.getServicePoints);
  const data = useQuery(api.organisation.getOrganisationsBySearchQuery, {
    query: val,
    ownerId: id!,
  });
  const addSuggestionToDb = useMutation(api.suggestions.addToSuggestions);
  const suggestions = useQuery(api.suggestions.getSuggestions, {
    query: value,
  });

  if (topSearch === undefined || servicePoints === undefined) {
    return (
      <Container>
        <SearchComponent />
        <LoadingComponent />
      </Container>
    );
  }
  const dataToArray = data || [];

  const servicePointsByName = searchesByServicePointName || [];
  const dataToRender = [...new Set([...dataToArray, ...servicePointsByName])];

  const addSuggestion = async () => {
    await addSuggestionToDb({ suggestion: val });
  };
  const showResultText =
    val !== '' && (searchesByServicePointName?.length ?? 0) > 0;
  const loading = val?.length > 0 && searchesByServicePointName === undefined;

  const hide = dataToRender.length > 0;
  return (
    <Container>
      <SearchComponent value={value} setValue={setValue} />
      {value && suggestions && <Suggestions suggestions={suggestions} />}
      {topSearch.length > 0 && <TSearch data={topSearch} />}

      {servicePoints.length > 0 && (
        <RenderSuggestions suggestions={servicePoints} hide={hide} />
      )}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          ListHeaderComponent={() =>
            showResultText ? (
              <MyText
                poppins="Medium"
                style={{
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                Results
              </MyText>
            ) : null
          }
          style={{ marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          data={dataToRender}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return <OrganizationItem item={item!} addToDb={addSuggestion} />;
          }}
          ListEmptyComponent={() =>
            val ? (
              <MyText poppins="Bold" fontSize={15}>
                No results found
              </MyText>
            ) : null
          }
        />
      )}
    </Container>
  );
};

export default Search;

const OrganizationItem = ({
  item,
  addToDb,
}: {
  item: SearchServicePoints;
  addToDb: () => void;
}) => {
  const increaseCount = useMutation(api.organisation.increaseSearchCount);

  const router = useRouter();
  const onPress = async () => {
    // @ts-ignore
    router.push(`reception/${item.id}`);
    addToDb();
    try {
      await increaseCount({ id: item.id });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1, marginBottom: 10 },
      ]}
      onPress={onPress}
    >
      <HStack alignItems="center" gap={10}>
        <Avatar rounded source={{ uri: item.avatar! }} size={50} />
        <VStack>
          <MyText poppins="Bold" fontSize={14}>
            {item?.name}
          </MyText>
          <MyText poppins="Medium" fontSize={12}>
            {item?.description}
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};
