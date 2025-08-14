import { FontAwesome } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { toast } from 'sonner-native';

import { CustomInput } from '../InputComponent';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { MyText } from '../Ui/MyText';
import VStack from '../Ui/VStack';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { api } from '~/convex/_generated/api';
import { Doc } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { useDarkMode } from '~/hooks/useDarkMode';
import { uploadProfilePicture } from '~/lib/helper';
import { profileUpdateSchema, ProfileUpdateSchemaType } from '~/schema';
import { Avatar } from '../Ui/Avatar';

export const ProfileUpdateForm = ({ person }: { person: Doc<'users'> }) => {
  const updateUser = useMutation(api.users.updateUserById);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  // const updateImage = useMutation(api.users.updateImage);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },

    reset,
  } = useForm<ProfileUpdateSchemaType>({
    defaultValues: {
      firstName: person?.name?.split(' ')[0] || '',
      lastName: person?.name?.split(' ')[1] || '',
      phoneNumber: person?.phoneNumber || '',
      avatar: person.image || '',
    },
    resolver: zodResolver(profileUpdateSchema),
  });

  const onSubmit = async (values: ProfileUpdateSchemaType) => {
    const { firstName, lastName, phoneNumber } = values;

    const name = `${firstName} ${lastName}`;
    try {
      if (selectedImage) {
        const res = await uploadProfilePicture(
          generateUploadUrl,
          selectedImage.uri
        );
        if (!res?.storageId) return;
        await updateUser({
          name,
          phoneNumber,
          _id: person._id,
          imageUrl: res.storageId,
        });
      } else {
        await updateUser({
          name,
          phoneNumber,
          _id: person._id,
        });
      }
      reset();
      router.back();
    } catch (error: any) {
      toast.error('Error updating profile');

      console.log(error, 'Error');
    }
  };

  const { darkMode } = useDarkMode();

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,

      quality: 0.5,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  if (!person) return <LoadingComponent />;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        >
          <Avatar
            image={selectedImage?.uri || person.image!}
            height={100}
            width={100}
          />

          <TouchableOpacity
            style={[
              styles.abs,
              { backgroundColor: darkMode ? 'white' : 'black' },
            ]}
            onPress={pickImageAsync}
          >
            <FontAwesome
              name="plus"
              size={20}
              color={darkMode ? 'black' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
        <MyText style={{ marginBottom: 10 }} poppins="Bold" fontSize={14}>
          User information
        </MyText>

        <VStack gap={10}>
          <CustomInput
            control={control}
            errors={errors}
            label="First Name"
            placeholder="First Name"
            autoCapitalize="sentences"
            name={'firstName'}
          />

          <>
            <CustomInput
              control={control}
              errors={errors}
              label="Last Name"
              placeholder="Last Name"
              name={'lastName'}
              autoCapitalize="sentences"
            />
          </>

          <>
            <CustomInput
              control={control}
              errors={errors}
              label="Phone Number"
              placeholder="Phone Number"
              name={'phoneNumber'}
            />
          </>
        </VStack>

        <View style={{ marginTop: 50 }}>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title={'Save changes'}
            loadingTitle={'Saving'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  error: { color: 'red', marginTop: 2 },
  date: {
    height: 120,
    marginTop: -10,
  },
  camera: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    width: 20,
    height: 20,
    borderRadius: 9999,
    lineHeight: 20,
    verticalAlign: 'middle',
    position: 'absolute',
    bottom: 2,
    right: -2,
  },

  phone: {
    width: '100%',
    backgroundColor: '#E9E9E9',
    height: 60,
    paddingHorizontal: 20,

    borderRadius: 2,
  },

  border: {
    borderRadius: 2,
    minHeight: 50,
    alignItems: 'center',

    height: 60,
    backgroundColor: '#E9E9E9',
    borderWidth: 0,
  },
  content: {
    paddingLeft: 10,

    width: 60,
    color: 'black',
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
  },

  container: {
    backgroundColor: '#E9E9E9',
    color: 'black',
    fontFamily: 'PoppinsMedium',
    marginTop: 10,
  },
  abs: {
    position: 'absolute',
    bottom: 0,
    right: 3,

    padding: 5,
    borderRadius: 30,
  },
});
