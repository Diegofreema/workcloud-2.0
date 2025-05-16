import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@rneui/themed';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
import { AuthTitle } from '~/components/AuthTitle';
import { InputComponent } from '~/components/InputComponent';
import { Subtitle } from '~/components/Subtitle';
import { Container } from '~/components/Ui/Container';
import { MyText } from '~/components/Ui/MyText';
import { days } from '~/constants';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetCat } from '~/hooks/useGetCat';
import { useGetUserId } from '~/hooks/useGetUserId';
import { uploadProfilePicture } from '~/lib/helper';

const validationSchema = yup.object().shape({
  organizationName: yup.string().required('Name of organization is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  startDay: yup.string(),
  endDay: yup.string(),
  startTime: yup.string().required('Working time is required'),
  endTime: yup.string().required('Working time is required'),
  websiteUrl: yup.string().required('Website link is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  image: yup.string().required('Logo is required'),
});

const CreateWorkSpace = () => {
  const [startTime, setStartTime] = useState(new Date(1598051730000));
  const cat = useGetCat((state) => state.cat);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const createOrganization = useMutation(api.organisation.createOrganization);
  const updateUserTableWithOrganizationId = useMutation(
    api.organisation.updateUserTableWithOrganizationId
  );
  const [endTime, setEndTime] = useState(new Date(1598051730000));
  const [avatar, setAvatar] = useState<string>('https://placehold.co/100x100');
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const { id } = useGetUserId();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const { darkMode } = useDarkMode();
  const router = useRouter();

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
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return;

      try {
        const { storageId } = await uploadProfilePicture(
          selectedImage,
          generateUploadUrl
        );
        const organizationId = await createOrganization({
          ownerId: id,
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
        });

        if (organizationId) {
          await updateUserTableWithOrganizationId({
            userId: id,
            organizationId,
          });
          router.replace(`/my-org`);
          toast.success('Success', {
            description: 'Organization has been created successfully',
          });
          resetForm();
        }
      } catch (e) {
        console.log(e);
        toast.error('Something went wrong', {
          description: "Couldn't create organization",
        });
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

  // ! to fix later
  const handleDeleteImage = () => {
    setValues({ ...values, image: '' });
    setAvatar('https://placehold.co/100x100');
  };
  const {
    email,
    category,
    location,
    organizationName,
    description,
    websiteUrl,
  } = values;

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
                  source={{ uri: selectedImage?.uri || avatar }}
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
              {errors.image && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.image}
                </Text>
              )}
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
                  editable={false}
                  label="Category"
                  value={category}
                  onChangeText={handleChange('category')}
                  placeholder="Category"
                  keyboardType="default"
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
                autoCapitalize="none"
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
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={{ color: 'red', fontFamily: 'PoppinsMedium' }}>
                  {errors.email}
                </Text>
              )}
            </>
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
                setSelected={handleChange('startDay')}
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
                  backgroundColor: '#E9E9E9',
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
                setSelected={handleChange('endDay')}
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
          <View style={{ flex: 0.4, marginTop: 30, marginHorizontal: 10 }}>
            <Button
              loading={isSubmitting}
              onPress={() => handleSubmit()}
              color={colors.buttonBlue}
              buttonStyle={{
                borderRadius: 10,
                height: 50,
              }}
              titleStyle={{ fontFamily: 'PoppinsMedium', color: colors.white }}
              title={isSubmitting ? 'Creating...' : 'Create'}
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
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#DADADA',
    borderRadius: 5,
    width: '100%',
    height: 60,
  },
});
