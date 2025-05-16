import { convexQuery } from '@convex-dev/react-query';
import { Button } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { toast } from 'sonner-native';
import * as yup from 'yup';

import { CompleteDialog } from '~/components/Dialogs/SavedDialog';
import { HeaderNav } from '~/components/HeaderNav';
import { InputComponent } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useSaved } from '~/hooks/useSaved';
import { useStaffRole } from '~/hooks/useStaffRole';

const validationSchema = yup.object().shape({
  role: yup.string().required('Role is required'),
  responsibility: yup.string().required('responsibility is required'),
  salary: yup.string().required('salary is required'),
  qualities: yup.string().required('qualities are required'),
});

const CompleteRequest = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workers'> }>();

  const selectedRole = useStaffRole((state) => state.role);

  const { isOpen, onClose } = useSaved();
  const { id: senderId } = useGetUserId();
  const router = useRouter();
  const { data, isPaused, isPending, isError, refetch, isRefetchError } =
    useQuery(convexQuery(api.worker.getSingleWorkerProfile, { id }));
  const sendRequest = useMutation(api.request.createRequest);
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      role: '',
      responsibility: '',
      salary: '',
      qualities: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { responsibility, salary, qualities, role } = values;
      if (!senderId || !data?.user) return;
      try {
        await sendRequest({
          role,
          salary,
          qualities,
          responsibility,
          from: senderId,
          to: data?.user?._id,
        });
        toast.success('Request sent');
        resetForm();
        router.replace('/pending-staffs');
      } catch (error) {
        console.log(error);
        toast.error('Error, failed to send request');
      }
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setTimeout(() => {
        router.push('/allStaffs');
        onClose();
      }, 1500);
    }

    return () => clearTimeout(interval);
  }, [isOpen, onClose, router]);
  useEffect(() => {
    if (selectedRole) {
      setValues({ ...values, role: selectedRole });
    }
  }, [selectedRole, setValues, values]);
  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const { responsibility, role, salary } = values;

  return (
    <Container>
      <HeaderNav title="Complete Request" />
      <CompleteDialog text="Request sent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={{ marginVertical: 10 }}>
          <UserPreview
            imageUrl={data?.user?.imageUrl!}
            name={data?.user?.name}
            roleText={data?.worker?.role}
            workPlace={data?.organization?.name}
            personal
          />
        </View>

        <VStack mt={30}>
          <>
            <MyText
              style={{
                fontSize: 15,
                color: 'black',
                marginBottom: 10,
                marginLeft: 10,
              }}
              poppins="Bold"
            >
              Role
            </MyText>
            <TouchableOpacity
              style={styles.press}
              onPress={() => router.push('/staff-role')}
            >
              <MyText
                style={{ fontFamily: 'PoppinsLight', fontSize: 13 }}
                poppins="Light"
              >
                {role || 'Select a role'}
              </MyText>
            </TouchableOpacity>
            {touched.role && errors.role && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.role}
              </Text>
            )}
          </>

          <>
            <InputComponent
              label="Responsibility"
              value={responsibility}
              onChangeText={handleChange('responsibility')}
              placeholder="What will this person do in your workspace?"
              keyboardType="default"
              multiline
              numberOfLines={4}
            />
            {touched.responsibility && errors.responsibility && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.responsibility}
              </Text>
            )}
          </>

          <>
            <InputComponent
              label="Qualities"
              value={values.qualities}
              onChangeText={handleChange('qualities')}
              placeholder="What qualities are you looking for?"
              keyboardType="default"
              multiline
              numberOfLines={4}
            />
            {touched.qualities && errors.qualities && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.qualities}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Salary"
              value={salary}
              onChangeText={handleChange('salary')}
              placeholder="Input a salary range in naira"
              keyboardType="number-pad"
            />
            {touched.salary && errors.salary && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.salary}
              </Text>
            )}
          </>
        </VStack>

        <Button
          icon={
            isSubmitting && (
              <ActivityIndicator
                style={{ marginRight: 10 }}
                size={20}
                color="white"
              />
            )
          }
          titleStyle={{ fontFamily: 'PoppinsMedium' }}
          buttonStyle={{
            backgroundColor: colors.dialPad,
            borderRadius: 5,
            marginTop: 25,
            marginHorizontal: 10,
            height: 60,
          }}
          onPress={() => handleSubmit()}
        >
          Send Request
        </Button>
      </ScrollView>
    </Container>
  );
};

export default CompleteRequest;

const styles = StyleSheet.create({
  press: {
    borderBottomColor: 'transparent',
    backgroundColor: '#E5E5E5',
    borderBottomWidth: 0,
    paddingHorizontal: 8,
    borderRadius: 5,
    height: 60,
    marginHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
});
