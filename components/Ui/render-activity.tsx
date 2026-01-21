import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { toast } from 'sonner-native';
import { ActivityTop } from '~/components/activity-top';
import { ActivitiesType } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { CustomModal } from '~/features/workspace/components/modal/custom-modal';
import { generateErrorMessage } from '~/lib/helper';
import { Text } from '../Themed';
import VStack from './VStack';
import { useUpdateStarred } from '~/hooks/use-update-starred';

type Props = {
  item: ActivitiesType;
  isProcessor: boolean;
};

export const RenderActivity = ({ item, isProcessor }: Props): JSX.Element => {
  const [updating, setUpdating] = useState(false);

  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState(item.text);
  const [sending, setSending] = useState(false);
  const updateStar = useMutation(api.worker.updateStarStatus);
  const deleteStar = useMutation(api.worker.deleteStarStatus);

  const editStar = useMutation(api.worker.editStarStatus);
  const isSeen = item.seen;

  useUpdateStarred({ isProcessor, isSeen, id: item._id });
  const onUpdate = async () => {
    if (!isProcessor) return;
    setUpdating(true);
    try {
      await updateStar({ id: item._id });
      toast.success('Success', {
        description: 'Status updated',
      });
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Failed to update');
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setUpdating(false);
    }
  };

  const onDelete = async (id: Id<'stars'>) => {
    setUpdating(true);
    try {
      await deleteStar({ id });
      toast.success('Success', {
        description: 'Status updated',
      });
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Failed to update');
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setUpdating(false);
    }
  };
  const onAlertDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete(item._id),
        style: 'destructive',
      },
    ]);
  };

  const onEdit = async () => {
    setSending(true);
    try {
      await editStar({ id: item._id, text: message.trim() });
      toast.success('Success', {
        description: 'Status updated',
      });
      setEdit(false);
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Failed to update');
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setSending(false);
    }
  };
  const onCloseModal = () => {
    setEdit(false);
    setMessage(item.text);
  };

  return (
    <View>
      <ActivityTop
        status={item.status}
        image={item.user.image as string}
        isProcessor={isProcessor}
        name={item.user.name as string}
        seen={isSeen}
        onDelete={onAlertDelete}
        onEdit={() => setEdit(true)}
        message={item.text}
        onUpdate={onUpdate}
        updating={updating}
        owner={item.owner}
        assignedTo={item.assignedToProfile}
      />

      <CustomModal
        isOpen={edit}
        onClose={onCloseModal}
        title="Edit"
        children={
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={100}
            style={styles.content}
          >
            <VStack mx={10}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type why you starred this account"
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={onCloseModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sendButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Button
                  style={styles.saveButton}
                  onPress={onEdit}
                  disabled={sending || !message}
                  loading={sending}
                  title="Edit"
                  loadingTitle="Editing..."
                />
              </View>
            </VStack>
          </KeyboardAvoidingView>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    width: 150,
    marginTop: 10,
  },

  inputContainer: {
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#e8f2ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {},
});
