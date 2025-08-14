import { convexQuery } from '@convex-dev/react-query';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { toast } from 'sonner-native';

import { AuthHeader } from '~/components/AuthHeader';

import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { days } from '~/constants';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { useTheme } from '~/hooks/use-theme';
import { useGetCat } from '~/hooks/useGetCat';
import { convertTimeToDateTime, uploadProfilePicture } from '~/lib/helper';
import { editOrganizationSchema, EditOrganizationSchemaType } from '~/schema';
import { ThemedText } from '~/components/Ui/themed-text';

const Edit = () => {
  const { editId } = useLocalSearchParams<{ editId: Id<'organizations'> }>();

  const { data, isPending, isError, refetch } = useQuery(
    convexQuery(api.organisation.getOrganisationById, {
      organisationId: editId!,
    })
  );
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateOrganization = useMutation(api.organisation.updateOrganization);

  const [start, setStartTime] = useState(new Date(1598051730000));
  const [end, setEndTime] = useState(new Date(1598051730000));

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const { theme: darkMode } = useTheme();
  const cat = useGetCat((state) => state.cat);
  const router = useRouter();
  const startDay = data?.workDays?.split('-')?.[0]?.trim() || '';
  const endDay = data?.workDays?.split('-')?.[1]?.trim() || '';
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    watch,
  } = useForm<EditOrganizationSchemaType>({
    defaultValues: {
      email: data?.email || '',
      organizationName: data?.name || '',
      category: data?.category || '',
      startDay,
      endDay,
      description: data?.description || '',
      location: data?.location || '',
      websiteUrl: data?.website || '',
      startTime: data?.start || '',
      endTime: data?.end || '',
      image: data?.avatar || '',
    },
    resolver: zodResolver(editOrganizationSchema),
  });
  useEffect(() => {
    if (data) {
      setValue('email', data.email);
      setValue('organizationName', data.name);
      setValue('category', data.category);
      setValue('startDay', startDay);
      setValue('endDay', endDay);
      setValue('description', data.description);
      setValue('location', data.location);
      setValue('websiteUrl', data.website);
      setValue('startTime', data.start);
      setValue('endTime', data.end);
      setValue('image', data.avatar!);
    }
  }, [data, setValue, startDay, endDay]);
  const onSubmit = async (values: EditOrganizationSchemaType) => {
    if (!data) return;
    try {
      if (selectedImage) {
        const res = await uploadProfilePicture(
          generateUploadUrl,
          selectedImage.uri
        );
        if (!res?.storageId) return;
        await updateOrganization({
          avatar: res?.storageId,
          end: values.endTime,
          name: values.organizationName,
          start: values.startTime,
          website: values.websiteUrl,
          workDays: values.startDay + ' - ' + values.endDay,
          category: values.category,
          description: values.description,
          email: values.email,
          location: values.location,
          organizationId: editId,
          oldId: data.avatarId,
        });
      } else {
        await updateOrganization({
          avatar: data?.avatar!,
          end: values.endTime,
          name: values.organizationName,
          start: values.startTime,
          website: values.websiteUrl,
          workDays: values.startDay + ' - ' + values.endDay,
          category: values.category,
          description: values.description,
          email: values.email,
          location: values.location,
          organizationId: editId,
        });
      }

      reset();
      toast.success('Success', {
        description: 'Organization updated successfully',
      });
      // queryClient.invalidateQueries({
      //   queryKey: ['organizations', 'organization'],
      // });

      router.replace('/my-org');
    } catch (error) {
      toast.error('Error', {
        description: 'An error occurred please try again',
      });
      console.log(error);
    }
  };

  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      const imgUrl = result.assets[0];
      setSelectedImage(imgUrl);
      setValue('image', imgUrl.uri);
    }
  };

  useEffect(() => {
    if (data) {
      const start = convertTimeToDateTime(data.start);
      const end = convertTimeToDateTime(data.end);
      setStartTime(new Date(start));
      setEndTime(new Date(end));
    }
  }, [data]);

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
  const handleDeleteImage = () => {
    setValue('image', '');
    setSelectedImage(null);
  };

  const { startDay: s, endDay: e, image } = watch();

  if (isError) {
    return <ErrorComponent refetch={refetch} text={'Something went wrong!'} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }
  console.log({ image, i: data?.avatar });

  return (
    <Container>
      <ScrollView
        style={[{ flex: 1 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <AuthHeader path="Edit Organization" />

        <View style={{ marginTop: 20, flex: 1, gap: 20 }}>
          <View style={{ gap: 20 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              >
                <Image
                  contentFit="cover"
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={image}
                  placeholder={require('../../../../assets/images.png')}
                />
                {!image && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 3,
                      backgroundColor: darkMode ? 'white' : 'black',
                      padding: 5,
                      borderRadius: 30,
                    }}
                    onPress={onSelectImage}
                  >
                    <FontAwesome
                      name="plus"
                      size={20}
                      color={darkMode ? 'black' : 'white'}
                    />
                  </TouchableOpacity>
                )}
                {image && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 3,
                      backgroundColor: darkMode ? 'white' : 'black',
                      padding: 5,
                      borderRadius: 30,
                    }}
                    onPress={handleDeleteImage}
                  >
                    <FontAwesome name="trash" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

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
          </View>

          <View style={{ gap: 20, marginBottom: 15 }}>
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
              }}
              inputStyles={{
                textAlign: 'left',
                fontSize: 14,
                borderWidth: 0,
                width: '100%',
                color: darkMode === 'dark' ? 'white' : 'black',
              }}
              fontFamily="PoppinsMedium"
              setSelected={(value: string) => setValue('startDay', value)}
              data={days}
              defaultOption={{
                key: startDay,
                value: s.charAt(0).toUpperCase() + s.slice(1),
              }}
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
              }}
              dropdownTextStyles={{
                color: darkMode === 'dark' ? 'white' : 'black',
              }}
              inputStyles={{
                textAlign: 'left',
                fontSize: 14,
                width: '100%',
                color: darkMode === 'dark' ? 'white' : 'black',
              }}
              fontFamily="PoppinsMedium"
              setSelected={(value: string) => setValue('endDay', value)}
              data={days}
              defaultOption={{
                key: e,
                value: e.charAt(0).toUpperCase() + e.slice(1),
              }}
              save="key"
              placeholder="Select End day"
            />
          </View>

          <ThemedText
            style={{
              marginBottom: 5,
              fontFamily: 'PoppinsMedium',
              marginHorizontal: 10,
            }}
          >
            Opening And Closing Time
          </ThemedText>
          <View
            style={{ flexDirection: 'column', gap: 10, marginHorizontal: 10 }}
          >
            <>
              <Pressable onPress={showMode} style={styles2.border}>
                <ThemedText>
                  {' '}
                  {`${format(start, 'HH:mm') || ' Opening Time'}`}{' '}
                </ThemedText>
              </Pressable>

              {show && (
                <DateTimePicker
                  display="spinner"
                  testID="dateTimePicker"
                  value={start}
                  mode="time"
                  is24Hour
                  onChange={(event, selectedDate) =>
                    onChange(event, selectedDate, 'startTime')
                  }
                />
              )}
            </>
            <>
              <Pressable onPress={showMode2} style={styles2.border}>
                <ThemedText>
                  {`${format(end, 'HH:mm') || ' Closing Time'}`}{' '}
                </ThemedText>
              </Pressable>

              {show2 && (
                <DateTimePicker
                  display="spinner"
                  testID="dateTimePicker"
                  value={end}
                  mode="time"
                  is24Hour
                  onChange={(event, selectedDate) =>
                    onChange(event, selectedDate, 'endTime')
                  }
                />
              )}
            </>
          </View>

          <View style={{ marginTop: 30 }}>
            <Button
              title={'Update'}
              onPress={handleSubmit(onSubmit)}
              loadingTitle={'Updating...'}
              loading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default Edit;

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
});
