import { Container } from '~/components/Ui/Container';
import { HeaderNav } from '~/components/HeaderNav';
import { FetchReview } from '~/features/organization/components/fetch-review';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { Plus } from 'lucide-react-native';
import { useTheme } from '~/hooks/use-theme';

const Review = () => {
  const { orgId, owner } = useLocalSearchParams<{
    orgId: Id<'organizations'>;
    owner: string;
  }>();
  const theme = useTheme((state) => state.theme);
  const isOwner = !!owner;
  return (
    <Container>
      <HeaderNav
        title={'Reviews'}
        rightComponent={
          !isOwner && (
            <CustomPressable
              onPress={() => router.push(`/upload-review?id=${orgId}`)}
            >
              <Plus color={theme === 'dark' ? '#fff' : '#000'} size={25} />
            </CustomPressable>
          )
        }
      />

      <FetchReview id={orgId} />
    </Container>
  );
};
export default Review;
