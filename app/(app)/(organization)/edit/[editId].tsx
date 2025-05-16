import { convexQuery } from '@convex-dev/react-query';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
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
import * as yup from 'yup';

import { AuthHeader } from '~/components/AuthHeader';
import { InputComponent } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyButton } from '~/components/Ui/MyButton';
import { MyText } from '~/components/Ui/MyText';
import { days } from '~/constants';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetCat } from '~/hooks/useGetCat';
import { convertTimeToDateTime, uploadProfilePicture } from '~/lib/helper';

const validationSchema = yup.object().shape({
  organizationName: yup.string().required('Name of organization is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  startDay: yup.string().required('Working days are required'),
  endDay: yup.string().required('Working days are required'),
  startTime: yup.string().required('Working time is required'),
  endTime: yup.string().required('Working time is required'),
  websiteUrl: yup.string().required('Website link is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  image: yup.string().required('Logo is required'),
});

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

  const { darkMode } = useDarkMode();
  const cat = useGetCat((state) => state.cat);
  const router = useRouter();
  const startDay = data?.workDays?.split('-')?.[0]?.trim() || '';
  const endDay = data?.workDays?.split('-')?.[1]?.trim() || '';
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
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
    validationSchema,
    onSubmit: async (values) => {
      if (!data) {
        return;
      }
      try {
        if (selectedImage) {
          const { storageId } = await uploadProfilePicture(
            selectedImage,
            generateUploadUrl
          );
          await updateOrganization({
            avatar: storageId,
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

        resetForm();
        toast.success('Success', {
          description: 'Organization updated successfully',
        });
        // queryClient.invalidateQueries({
        //   queryKey: ['organizations', 'organization'],
        // });

        router.replace('/my-org');
      } catch (error) {
        console.log(error);
      }
    },
  });
  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      const imgUrl = result.assets[0];
      setSelectedImage(imgUrl);
      await setValues({
        ...values,
        image: imgUrl?.uri,
      });
    }
  };

  useEffect(() => {
    if (data) {
      setValues({
        ...values,
        email: data?.email!,
        category: data?.category!,
        location: data?.location!,
        organizationName: data?.name!,
        description: data?.description!,
        websiteUrl: data?.website!,
        startTime: data?.start!,
        endTime: data?.end!,
        image: data?.avatar!,
        startDay,
        endDay,
      });
      const start = convertTimeToDateTime(data.start);
      const end = convertTimeToDateTime(data.end);
      setStartTime(new Date(start));
      setEndTime(new Date(end));
    }
  }, [data, endDay, setValues, startDay, values]);

  useEffect(() => {
    if (cat) {
      setValues({ ...values, category: cat });
    }
  }, [cat, setValues, values]);
  const onChange = (event: any, selectedDate: any, type: string) => {
    const currentDate = selectedDate;
    if (type === 'startTime') {
      setShow(false);
      setStartTime(currentDate);
      setValues({ ...values, startTime: format(currentDate, 'HH:mm') });
    } else {
      setShow2(false);
      setEndTime(currentDate);
      setValues({ ...values, endTime: format(currentDate, 'HH:mm') });
    }
  };
  const showMode = () => {
    setShow(true);
  };
  const showMode2 = () => {
    setShow2(true);
  };
  const handleDeleteImage = () => {
    setValues({ ...values, image: '' });
  };

  const {
    email,
    category,
    location,
    organizationName,
    description,
    websiteUrl,
    image,
    startDay: s,
    endDay: e,
  } = values;

  if (isError) {
    return <ErrorComponent refetch={refetch()} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <ScrollView
        style={[{ flex: 1 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <AuthHeader path="Edit Organization" />

        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={{ flex: 0.6, gap: 10 }}>
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
                />
                {!values.image && (
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
                {values.image && (
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

            <>
              <InputComponent
                label="Organization Name"
                value={organizationName}
                onChangeText={handleChange('organizationName')}
                placeholder="Organization Name"
                keyboardType="default"
              />
              {touched.organizationName && errors.organizationName && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.organizationName}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Description"
                value={description}
                onChangeText={handleChange('description')}
                placeholder="Description"
                keyboardType="default"
                numberOfLines={5}
                textarea
              />
              {touched.description && errors.description && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.description}
                </Text>
              )}
            </>
            <>
              <Pressable
                onPress={() => router.push('/category')}
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <InputComponent
                  label="Category"
                  value={category}
                  onChangeText={handleChange('category')}
                  placeholder="Category"
                  keyboardType="default"
                  editable={false}
                />
              </Pressable>
              {touched.category && errors.category && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.category}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Location"
                value={location}
                onChangeText={handleChange('location')}
                placeholder="Location"
                keyboardType="default"
              />
              {touched.location && errors.location && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.location}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Website Link"
                value={websiteUrl}
                onChangeText={handleChange('websiteUrl')}
                placeholder="Website link"
                keyboardType="default"
              />
              {touched.websiteUrl && errors.websiteUrl && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.websiteUrl}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Email"
                value={email}
                onChangeText={handleChange('email')}
                placeholder="Email"
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.email}
                </Text>
              )}
            </>
          </View>

          <View style={{ marginHorizontal: 10, gap: 15, marginBottom: 15 }}>
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
              }}
              fontFamily="PoppinsMedium"
              setSelected={handleChange('startDay')}
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
                backgroundColor: '#E9E9E9',
                width: '100%',
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
              setSelected={handleChange('endDay')}
              data={days}
              defaultOption={{
                key: e,
                value: e.charAt(0).toUpperCase() + e.slice(1),
              }}
              save="key"
              placeholder="Select End day"
            />
          </View>

          <Text
            style={{
              marginBottom: 5,
              fontFamily: 'PoppinsMedium',
              marginHorizontal: 10,
            }}
          >
            Opening And Closing Time
          </Text>
          <View
            style={{ flexDirection: 'column', gap: 10, marginHorizontal: 10 }}
          >
            <>
              <Pressable onPress={showMode} style={styles2.border}>
                <Text> {`${format(start, 'HH:mm') || ' Opening Time'}`} </Text>
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
                <Text>{`${format(end, 'HH:mm') || ' Closing Time'}`} </Text>
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

          <View style={{ flex: 0.4, marginTop: 30 }}>
            <MyButton
              loading={isSubmitting}
              onPress={() => handleSubmit()}
              buttonColor={colors.buttonBlue}
              buttonStyle={{ width: 200 }}
              textColor={colors.white}
              labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
              contentStyle={{ height: 50, borderRadius: 20 }}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </MyButton>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default Edit;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,

    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    width: '100%',
  },
});
