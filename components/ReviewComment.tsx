import { Rating } from 'react-native-ratings';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { HStack } from '~/components/HStack';
import { Avatar } from '~/components/Ui/Avatar';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { ReviewType } from '~/constants/types';
import { formatDateToNowHelper } from '~/lib/helper';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';
import { Reply } from '~/features/review/component/reply';
import { CustomPressable } from './Ui/CustomPressable';

type Props = {
  comment: ReviewType;
};

export const ReviewComment = ({ comment }: Props) => {
  const { owner } = useLocalSearchParams<{
    orgId: Id<'organizations'>;
    owner: string;
  }>();

  const isOwner = !!owner;
  const pathname = usePathname();
  const isOnSingleReviewPage = pathname.includes('reviews/review');
  const onPress = () => {
    if (!owner || isOnSingleReviewPage) return;

    router.push(
      `/orgs/reviews/review?reviewId=${comment._id}&owner=${owner}&orgId=${comment.organizationId}`
    );
  };
  return (
    <VStack gap={8}>
      <CustomPressable onPress={onPress}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" gap={5}>
            <Avatar image={comment?.user?.imageUrl!} height={40} width={40} />
            <MyText poppins="Medium" fontSize={RFPercentage(1.6)}>
              {comment?.user?.name}
            </MyText>
          </HStack>
          <MyText poppins="Light" fontSize={RFPercentage(1.3)}>
            {formatDateToNowHelper(new Date(comment._creationTime))} ago
          </MyText>
        </HStack>
        <MyText poppins="Light" fontSize={RFPercentage(1.5)}>
          {comment.text}
        </MyText>
        <Rating
          ratingCount={5}
          startingValue={comment.rating}
          imageSize={20}
          readonly
          style={{ alignSelf: 'flex-start' }}
        />
      </CustomPressable>
      <Reply isOwner={isOwner} reviewId={comment._id} />
    </VStack>
  );
};
