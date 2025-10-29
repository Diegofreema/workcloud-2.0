import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Alert, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { Input } from '~/components/Forms/Input';
import { HStack } from '~/components/HStack';
import Colors, { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import Card from '~/features/common/components/card';
import { useGetUserId } from '~/hooks/useGetUserId';
import { formatDateToNowHelper, generateErrorMessage } from '~/lib/helper';
type Props = {
  isOwner: boolean;
  reviewId: Id<'reviews'>;
};

export const Reply = ({ isOwner, reviewId }: Props) => {
  const addReply = useMutation(api.reviews.addReply);
  const { id } = useGetUserId();
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme || 'light'].text;
  // const backgroudColor = Colors[colorScheme || 'light'].background;
  const reply = useQuery(api.reviews.getReply, { reviewId });
  const deleteReply = useMutation(api.reviews.deleteReply);
  const editReply = useMutation(api.reviews.editReply);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [value, setValue] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replying, setReplying] = useState(false);
  const onCancel = () => {
    setShowReplyInput(false);
    setEditing(false);
    setValue('');
  };
  const onDelete = async () => {
    if (!reply || !id) return;
    Alert.alert('Are you sure?', 'This action cannot be undone', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteReply({
              replyId: reply.id,
              userId: id,
            });
            toast.success('Reply deleted');
          } catch (error) {
            const errorMessage = generateErrorMessage(
              error,
              'Failed to delete reply'
            );
            toast.error('Something went wrong', {
              description: errorMessage,
            });
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };
  const onReply = async () => {
    if (!value.trim()) return;
    try {
      setReplying(true);
      if (editing) {
        await editReply({
          replyId: reply?.id!,
          newReply: value,
          userId: id!,
        });
      } else {
        await addReply({
          reply: value,
          reviewId,
          from: id!,
        });
      }
      toast.success('Success');
      setShowReplyInput(false);
    } catch (e) {
      const errorMessage = generateErrorMessage(e, 'An error occurred.');
      toast.error(errorMessage);
    } finally {
      setReplying(false);
      setEditing(false);
    }
  };

  const onEdit = () => {
    if (!reply) return;
    setEditing(true);
    setValue(reply.reply);
    setShowReplyInput(true);
  };
  const disable = value.trim() === '' || replying;
  const disableEdit = reply?.reply === value || replying;
  if (reply === undefined) return null;
  return (
    <View>
      {isOwner && !showReplyInput && !reply && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Button
            title={'Reply'}
            onPress={() => setShowReplyInput(true)}
            style={{ backgroundColor: 'transparent' }}
            textStyle={{ color: colors.dialPad }}
          />
        </Animated.View>
      )}
      {showReplyInput && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Input
            label={'Reply'}
            placeholder={'Reply this comment'}
            value={value}
            onChangeText={setValue}
            style={{
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: 5,
              padding: 10,
              marginBottom: 50,
              color: textColor,
            }}
          />
          <HStack gap={10} style={{ marginHorizontal: 20 }}>
            <Button
              title={'Cancel'}
              onPress={onCancel}
              style={{ backgroundColor: colors.closeTextColor, flex: 1 }}
            />
            <Button
              title={editing ? 'Edit' : 'Reply'}
              onPress={onReply}
              disabled={editing ? disableEdit : disable}
              loading={replying}
              loadingTitle={editing ? 'Editing...' : 'Replying...'}
              style={{ backgroundColor: colors.dialPad, flex: 1 }}
            />
          </HStack>
        </Animated.View>
      )}

      {reply && (
        <Card style={{ boxShadow: '' }}>
          <Card.Header>
            <Card.Title>{reply.organizationName}</Card.Title>
            <Card.Description>
              {formatDateToNowHelper(new Date(reply.creationTime))} ago
            </Card.Description>
            <Card.Description>{reply.reply}</Card.Description>
          </Card.Header>
          {isOwner && (
            <Card.Footer>
              <HStack width={'100%'} gap={10}>
                <Button
                  disabled={deleting}
                  title={'Edit'}
                  onPress={onEdit}
                  style={{ flex: 1 }}
                />
                <Button
                  title={'Delete'}
                  onPress={onDelete}
                  loading={deleting}
                  loadingTitle={'Deleting...'}
                  disabled={deleting}
                  style={{ backgroundColor: colors.closeTextColor, flex: 1 }}
                />
              </HStack>
            </Card.Footer>
          )}
        </Card>
      )}
    </View>
  );
};
