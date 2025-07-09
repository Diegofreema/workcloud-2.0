import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { toast } from 'sonner-native';

import { AuthHeader } from '~/components/AuthHeader';
import { AuthTitle } from '~/components/AuthTitle';
import { CustomInput } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';
import { editWorkerSchema, EditWorkerSchemaType } from '~/schema';

const max = 150;
const genders = [
  {
    key: 'Male',
    value: 'male',
  },
  {
    key: 'Female',
    value: 'female',
  },
];
const CreateProfile = () => {
  const { darkMode } = useDarkMode();

  const { id } = useGetUserId();
  const data = useQuery(api.users.getWorkerProfileWithUser, {
    id: id as Id<'users'>,
  });
  const updateWorkerProfile = useMutation(api.users.updateWorkerProfile);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    watch,
  } = useForm<EditWorkerSchemaType>({
    defaultValues: {
      location: data?.location || '',
      gender: data?.gender || '',
      skills: data?.skills || '',
      experience: data?.experience || '',
      qualifications: data?.qualifications || '',
    },
    resolver: zodResolver(editWorkerSchema),
  });
  const onSubmit = async (values: EditWorkerSchemaType) => {
    try {
      if (!data?._id) return;
      await updateWorkerProfile({ _id: data?._id, ...values });

      toast.success(`${data?.user?.name} your work profile has been updated`);
      reset();
      router.back();
    } catch (error: any) {
      toast.error(error?.response?.data.error);
      console.log(error, 'Error');
    }
  };

  const { experience, gender } = watch();

  if (!data) {
    return <LoadingComponent />;
  }
  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <AuthHeader />
        <View style={{ marginBottom: 10 }} />
        <AuthTitle>Edit your worker's profile</AuthTitle>
        <MyText
          poppins="Light"
          fontSize={15}
          style={{ marginTop: 20, color: colors.textGray }}
        >
          Enter your details below
        </MyText>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={{ flex: 0.6, gap: 10 }}>
            <>
              <CustomInput
                control={control}
                errors={errors}
                name="experience"
                label="Experience"
                value={experience}
                placeholder="Write about your past work experience..."
                keyboardType="default"
                numberOfLines={5}
                maxLength={max}
                multiline
                textarea
              />
              <MyText poppins="Medium" fontSize={15}>
                {experience.length}/{max}
              </MyText>
            </>

            <CustomInput
              control={control}
              errors={errors}
              name="qualifications"
              label="Qualifications"
              placeholder="Bsc. Computer Science, Msc. Computer Science"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />

            <CustomInput
              label="Skills"
              name="skills"
              errors={errors}
              control={control}
              placeholder="e.g Customer service, marketing, sales"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />

            <CustomInput
              label="Location"
              control={control}
              errors={errors}
              name="location"
              placeholder="Where do you reside?"
              keyboardType="default"
              numberOfLines={5}
              multiline
            />

            <View style={{ marginHorizontal: 10 }}>
              <Text
                style={{
                  color: darkMode === 'dark' ? colors.white : colors.black,
                  fontWeight: 'bold',
                  fontSize: 15,
                  marginBottom: 10,
                }}
              >
                Gender
              </Text>

              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  justifyContent: 'flex-start',
                  width: '100%',
                  alignItems: 'center',
                }}
                dropdownTextStyles={{
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}
                inputStyles={{
                  textAlign: 'left',
                  borderWidth: 0,
                  color: 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                fontFamily="PoppinsMedium"
                setSelected={(value: string) => setValue('gender', value)}
                data={genders}
                defaultOption={{ key: gender, value: gender }}
                save="value"
                placeholder="Select your a gender"
              />

              {errors.gender && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.gender.message}
                </Text>
              )}
            </View>
          </View>
          <View style={{ flex: 0.4, marginTop: 30, marginHorizontal: 10 }}>
            <Button
              title={'Submit'}
              onPress={handleSubmit(onSubmit)}
              loadingTitle={'Submitting...'}
              loading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default CreateProfile;

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
