import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { toast } from 'sonner-native';
import { Button } from '~/features/common/components/Button';

import { AuthHeader } from '~/components/AuthHeader';
import { AuthTitle } from '~/components/AuthTitle';
import { CustomInput } from '~/components/InputComponent';

import { Subtitle } from '~/components/Subtitle';
import { Container } from '~/components/Ui/Container';
import { MyText } from '~/components/Ui/MyText';
import { days } from '~/constants';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetCat } from '~/hooks/useGetCat';
import { generateErrorMessage, uploadProfilePicture } from '~/lib/helper';
import {
  createOrganizationSchema,
  CreateOrganizationSchemaType,
} from '~/schema';
import { Trash } from 'lucide-react-native';

const CreateWorkSpace = () => {
  const [startTime, setStartTime] = useState(new Date(1598051730000));
  const { cat } = useGetCat();
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const createOrganization = useMutation(api.organisation.createOrganization);

  const [endTime, setEndTime] = useState(new Date(1598051730000));

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateOrganizationSchemaType>({
    defaultValues: {
      email: '',
      organizationName: '',
      category: '',
      startDay: 'Monday',
      endDay: 'Friday',
      description: '',
      location: '',
      websiteUrl: '',
      startTime: '',
      endTime: '',
      image: '',
    },
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit = async (values: CreateOrganizationSchemaType) => {
    try {
      const res = await uploadProfilePicture(
        generateUploadUrl,
        selectedImage?.uri
      );
      if (!res?.storageId) {
        toast.error('Something went wrong', {
          description: "Couldn't create organization",
        });
        return;
      }
      await createOrganization({
        avatarId: res?.storageId,
        end: values.endTime,
        name: values.organizationName,
        start: values.startTime,
        website: values.websiteUrl,
        workDays: values.startDay + ' - ' + values.endDay,
        category: values.category,
        description: values.description,
        email: values.email,
        location: values.location,
      });

      router.replace(`/my-org`);
      toast.success('Success', {
        description: 'Organization has been created successfully',
      });
      reset();
    } catch (e) {
      const errorMessage = generateErrorMessage(
        e,
        'Failed to create organization'
      );
      toast.error('Something went wrong', {
        description: errorMessage,
      });
    }
  };
  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.4,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      const imgUrl = result.assets[0];
      setSelectedImage(imgUrl);
      setValue('image', imgUrl?.uri);
    }
  };
  useEffect(() => {
    if (cat) {
      setValue('category', cat);
    }
  }, [cat, setValue]);
  const onChange = (event: any, selectedDate: any, type: string) => {
    const currentDate = selectedDate;
    if (type === 'startTime') {
      setShow(false);
      setStartTime(currentDate);
      setValue('startTime', format(currentDate, 'HH:mm'));
    } else {
      setShow2(false);
      setEndTime(currentDate);
      setValue('endTime', format(currentDate, 'HH:mm'));
    }
  };
  const showMode = () => {
    setShow(true);
  };
  const showMode2 = () => {
    setShow2(true);
  };

  // ! to fix later
  const handleDeleteImage = () => {
    setValue('image', '');
  };
  const { image } = watch();
  const pickImage = async () => {
    onSelectImage();
  };
  return (
    <Container>
      <ScrollView
        style={[{ flex: 1 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20, flexGrow: 1 }}
      >
        <AuthHeader />
        <View style={{ marginBottom: 20 }} />

        <AuthTitle>Create an organization</AuthTitle>
        <Subtitle>Enter your organization details</Subtitle>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={{ flex: 0.6, gap: 10 }}>
            <Text
              style={{
                color: darkMode === 'dark' ? 'white' : 'black',
                fontFamily: 'PoppinsMedium',
              }}
            >
              Organization logo
            </Text>
            <View>
              {image ? (
                <View style={styles2.imagePicker}>
                  <Image
                    source={{ uri: image }}
                    style={styles2.imageContent}
                    contentFit={'cover'}
                  />
                  <TouchableOpacity
                    onPress={handleDeleteImage}
                    style={styles2.trash}
                  >
                    <Trash size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles2.imagePicker}
                  onPress={pickImage}
                >
                  <Text style={[styles2.imageText]}>Click to select image</Text>
                </TouchableOpacity>
              )}
            </View>
            {errors.image && (
              <Text style={{ color: 'red', fontFamily: 'PoppinsMedium' }}>
                {errors.image.message}
              </Text>
            )}
            <CustomInput
              control={control}
              errors={errors}
              name="organizationName"
              placeholder="Organization Name"
              label="Organization Name"
            />
            <CustomInput
              control={control}
              errors={errors}
              name="description"
              placeholder="Description"
              label="Description"
              numberOfLines={5}
              multiline
              textarea
            />
            <Pressable
              onPress={() => router.push('/category')}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <CustomInput
                control={control}
                errors={errors}
                name="category"
                placeholder="Category"
                label="Category"
                editable={false}
              />
            </Pressable>
            <CustomInput
              control={control}
              errors={errors}
              name="location"
              placeholder="Location"
              label="Location"
            />
            <CustomInput
              control={control}
              errors={errors}
              name="websiteUrl"
              placeholder="Website link"
              label="Website Link"
            />
            <CustomInput
              control={control}
              errors={errors}
              name="email"
              placeholder="Email"
              label="Email"
              keyboardType="email-address"
            />
            <View style={{ marginHorizontal: 10, gap: 15 }}>
              <MyText
                fontSize={15}
                poppins="Medium"
                style={{ fontFamily: 'PoppinsMedium' }}
              >
                Work Days
              </MyText>

              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  justifyContent: 'flex-start',
                  width: '100%',
                  alignItems: 'center',
                }}
                inputStyles={{
                  textAlign: 'left',
                  fontSize: 14,
                  borderWidth: 0,
                  width: '100%',
                  paddingRight: 10,
                }}
                fontFamily="PoppinsMedium"
                setSelected={(value: string) => setValue('startDay', value)}
                data={days}
                defaultOption={{ key: 'monday', value: 'Monday' }}
                save="key"
                placeholder="Select Start Day"
                dropdownTextStyles={{
                  color: darkMode === 'dark' ? 'white' : 'black',
                }}
              />

              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  justifyContent: 'flex-start',
                  width: '100%',
                  alignItems: 'center',
                }}
                dropdownTextStyles={{
                  color: darkMode === 'dark' ? 'white' : 'black',
                }}
                inputStyles={{
                  textAlign: 'left',
                  fontSize: 14,
                  width: '100%',
                }}
                fontFamily="PoppinsMedium"
                setSelected={(value: string) => setValue('endDay', value)}
                data={days}
                defaultOption={{ key: 'friday', value: 'Friday' }}
                save="key"
                placeholder="Select End day"
              />
            </View>
            <>
              <MyText
                poppins="Medium"
                fontSize={15}
                style={{
                  marginVertical: 10,
                  fontFamily: 'PoppinsMedium',
                  marginHorizontal: 10,
                }}
              >
                Opening And Closing Time
              </MyText>
              <View style={{ gap: 10, marginHorizontal: 10 }}>
                <>
                  <Pressable onPress={showMode} style={styles2.border}>
                    <Text>
                      {' '}
                      {`${format(startTime, 'HH:mm') || ' Opening Time'}`}{' '}
                    </Text>
                  </Pressable>

                  {show && (
                    <>
                      <DateTimePicker
                        style={{ marginBottom: 20 }}
                        display="spinner"
                        testID="dateTimePicker"
                        value={startTime}
                        mode="time"
                        is24Hour
                        onChange={(event, selectedDate) =>
                          onChange(event, selectedDate, 'startTime')
                        }
                      />
                    </>
                  )}
                </>
                <>
                  <Pressable onPress={showMode2} style={styles2.border}>
                    <Text>
                      {' '}
                      {`${format(endTime, 'HH:mm') || ' Closing Time'}`}{' '}
                    </Text>
                  </Pressable>

                  {show2 && (
                    <DateTimePicker
                      display="spinner"
                      testID="dateTimePicker"
                      value={endTime}
                      mode="time"
                      is24Hour
                      onChange={(event, selectedDate) =>
                        onChange(event, selectedDate, 'endTime')
                      }
                    />
                  )}
                </>
              </View>
            </>
          </View>
          <View style={{ marginTop: 30 }}>
            <Button
              title={'Create'}
              onPress={handleSubmit(onSubmit)}
              loadingTitle={'Creating...'}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default CreateWorkSpace;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: 'transparent',
    minHeight: 52,
    borderRadius: 5,
    paddingLeft: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
    width: '100%',
  },
  imageText: {
    color: colors.grayText,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  imageContent: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderColor: colors.grayText,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  trash: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    zIndex: 3,
    backgroundColor: 'red',
    borderRadius: 99,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
