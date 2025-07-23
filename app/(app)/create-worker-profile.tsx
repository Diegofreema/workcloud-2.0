import { Text } from '@rneui/themed';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { toast } from 'sonner-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthHeader } from '~/components/AuthHeader';
import { AuthTitle } from '~/components/AuthTitle';
import { CustomInput } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';
import { useDarkMode } from '~/hooks/useDarkMode';
import { createWorkerSchema, CreateWorkerSchemaType } from '~/schema';

const max = 150;
const genders = [
  {
    key: 'Male',
    value: 'Male',
  },
  {
    key: 'Female',
    value: 'Female',
  },
];
const CreateProfile = () => {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  const router = useRouter();
  const createWorkerProfile = useMutation(api.users.createWorkerProfile);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateWorkerSchemaType>({
    defaultValues: {
      email: user?.email as string,
      location: '',
      gender: '',
      skills: '',
      experience: '',
      qualifications: '',
    },
    resolver: zodResolver(createWorkerSchema),
  });
  const onSubmit = async (values: CreateWorkerSchemaType) => {
    try {
      const id = await createWorkerProfile({
        ...values,
      });

      toast.success('Welcome  onboard', {
        description: `${user?.name?.split(' ')[0]} your work profile was created`,
      });

      router.replace(`/myWorkerProfile/${id}`);
      reset();
    } catch (error: any) {
      toast.error('Something went wrong', {
        description: 'Please try again',
      });
      console.log(error, 'Error');
    }
  };

  const { experience } = watch();

  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <AuthHeader />
        <View style={{ marginBottom: 10 }} />
        <AuthTitle>Set up your profile to work on workcloud</AuthTitle>
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
