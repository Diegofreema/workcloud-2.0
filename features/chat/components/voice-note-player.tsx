import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import SeekBar from '~/components/seekbar/SeekBar';
import { MyText } from '~/components/Ui/MyText';

const { width: screenWidth } = Dimensions.get('window');
type Props = {
  audioUri: string;
  isFromMe?: boolean;
};
export const VoiceNotePlayer = ({
  audioUri,

  isFromMe = false,
}: Props) => {
  const player = useAudioPlayer({ uri: audioUri }, 500);
  const status = useAudioPlayerStatus(player);

  // Animation values
  const isPlaying = status.playing;

  const playPause = async () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleProgressBarPress = (position: number) => {
    player.seekTo(position);
    player.play();
  };
  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [player, status.didJustFinish]);

  const progress = status.currentTime / status.duration;

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View
      style={[
        styles.container,
        isFromMe ? styles.containerFromMe : styles.containerFromOther,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={playPause} style={styles.playButton}>
          <Animated.View style={[styles.playButtonInner]}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#ffffff"
            />
          </Animated.View>
        </TouchableOpacity>

        <SeekBar
          value={progress}
          onValueChange={handleProgressBarPress}
          activeHeight={8}
          activeColor="#f4f4f5"
          disabled={false}
          height={4}
          width={140}
          inactiveColor="#27272a"
          tapToSeek
        />
      </View>
      <MyText
        poppins="Light"
        style={{ color: isFromMe ? '#f4f4f5' : '#27272a' }}
      >
        {formatTime(status.currentTime * 1000)}
      </MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    margin: 8,
    borderRadius: 12,
    maxWidth: '90%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  containerFromMe: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    marginLeft: screenWidth * 0.25,
  },
  containerFromOther: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    marginRight: screenWidth * 0.25,
  },
  playButton: {
    marginRight: 12,
  },
  playButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContent: {
    flex: 1,
  },
  waveformContainer: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    paddingHorizontal: 8,
  },
  waveBar: {
    width: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    marginHorizontal: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
