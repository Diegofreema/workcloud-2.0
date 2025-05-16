import { Rating } from 'react-native-ratings';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { HStack } from '~/components/HStack';
import { Avatar } from '~/components/Ui/Avatar';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { ReviewType } from '~/constants/types';
import { formatDateToNowHelper } from '~/lib/helper';

type Props = {
  comment: ReviewType;
};

export const ReviewComment = ({ comment }: Props) => {
  return (
    <VStack gap={8}>
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
    </VStack>
  );
};
