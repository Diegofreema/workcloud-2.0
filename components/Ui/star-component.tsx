// First, create your Zustand store (useStar.js)

// Main Component
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { api } from '~/convex/_generated/api';
import { useCallStore } from '~/features/calls/hook/useCallStore';
import { Button } from '~/features/common/components/Button';
import { generateErrorMessage } from '~/lib/helper';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const StarMessageComponent = ({ isOpen, setIsOpen }: Props) => {
  const {
    data: { workspaceId, customerId, customerImage, customerName },
  } = useCallStore();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const starCustomer = useMutation(api.workspace.starCustomer);
  // Shared values for animations
  const height = useSharedValue(0);

  useEffect(() => {
    // Animate height to 50 when there are pending members, 0 when none
    height.value = withSpring(isOpen ? 300 : 0, {
      damping: 10,
      stiffness: 100,
    });
  }, [isOpen, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const hideComponent = () => {
    setIsOpen(false);
    // Optional: Reset message when hiding
    // Wait for animation to complete
  };

  const handleSend = async () => {
    if (!workspaceId || !message || !customerId) return;
    setSending(true);
    try {
      await starCustomer({ workspaceId, customerId, text: message.trim() });
      toast.success('Starred successfully');
      hideComponent();
      setMessage('');
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Something went wrong');
      toast.error('Something went wrong', {
        description: errorMessage,
      });
    } finally {
      setSending(false);
    }
  };

  // Animated style for the component container

  return (
    <Animated.View style={[styles.starMessageContainer, animatedStyle]}>
      <Animated.View style={[styles.componentContent]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri: customerImage as string,
              }}
              style={styles.profileImage}
            />
            <View style={styles.headerText}>
              <Text style={styles.starredText}>You starred</Text>
              <Text style={styles.userName}>{customerName}</Text>
            </View>
          </View>
        </View>

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

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={hideComponent}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Button
            style={styles.saveButton}
            onPress={handleSend}
            disabled={sending || !message}
            loading={sending}
            title="Submit"
            loadingTitle="Submitting..."
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  stateInfo: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 30,
  },
  triggerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 15,
  },
  triggerButtonActive: {
    backgroundColor: '#34C759',
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hideButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  hideButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  externalControls: {
    alignItems: 'center',
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#6C7B7F',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  starMessageContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  componentContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },
  headerText: {
    flex: 1,
  },
  starredText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    color: '#666',
  },
  notificationIcon: {
    padding: 8,
  },
  bellIcon: {
    fontSize: 22,
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
});

export default StarMessageComponent;
