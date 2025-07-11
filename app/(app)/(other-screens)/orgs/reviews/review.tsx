import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { HeaderNav } from '~/components/HeaderNav';
import { ReviewComment } from '~/components/ReviewComment';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

const SingleReview = () => {
  const { reviewId } = useLocalSearchParams<{ reviewId: Id<'reviews'> }>();
  const review = useQuery(api.reviews.getReview, { reviewId });
  if (review === undefined) {
    return <LoadingComponent />;
  }
  if (!review) {
    return <Text>Review not found</Text>;
  }
  return (
    <Container>
      <HeaderNav title="Review" />
      <ReviewComment comment={review} />
    </Container>
  );
};

export default SingleReview;
