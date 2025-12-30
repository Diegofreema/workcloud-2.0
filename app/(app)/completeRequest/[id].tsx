import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { useConvex, useMutation } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { toast } from 'sonner-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { CompleteDialog } from '~/components/Dialogs/SavedDialog';
import { HeaderNav } from '~/components/HeaderNav';
import { CustomInput } from '~/components/InputComponent';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { useCreateStaffState } from '~/features/staff/hooks/use-create-staff-state';
import { convexPushNotificationsHelper } from '~/lib/utils';
import { offerSchema, OfferSchemaType } from '~/schema';

const CompleteRequest = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workers'> }>();
  const convex = useConvex();
  const { staffData } = useCreateStaffState();
  const finalRole =
    staffData?.type === 'processor' ? staffData.type : staffData.role;

  const router = useRouter();
  const { data, isPaused, isPending, isError, refetch, isRefetchError, error } =
    useQuery(convexQuery(api.worker.getSingleWorkerProfile, { id }));

  console.log({ user: data?.user?._id });

  const {
    data: orgData,
    isPending: orgPending,
    isError: orgError,
  } = useQuery(convexQuery(api.organisation.getOrganizationByBossId, {}));
  const sendRequest = useMutation(api.request.createRequest);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
    reset,
  } = useForm<OfferSchemaType>({
    defaultValues: {
      role: '',
      responsibility: '',
      salary: 0,
      qualities: '',
    },
    resolver: zodResolver(offerSchema),
  });
  const onSubmit = async (values: OfferSchemaType) => {
    const { responsibility, salary, qualities, role } = values;
    if (!data?.user) return;
    try {
      await sendRequest({
        role: role.trim(),
        salary: salary.toString().trim(),
        qualities: qualities.trim(),
        responsibility: responsibility.trim(),
        from: orgData?.ownerId!,
        to: data?.user?._id,
      });
      await convexPushNotificationsHelper(convex, {
        title: 'Offer Request',
        body: `${orgData?.name} sent you an offer request`,
        data: {
          type: 'notification',
        },
        to: data.user._id,
      });

      toast.success('Request sent');
      reset();
      router.replace('/pending-staffs');
    } catch (error) {
      console.log(error);
      toast.error('Error, failed to send request');
    }
  };

  useEffect(() => {
    if (finalRole) {
      setValue('role', finalRole);
    }
  }, [finalRole, setValue]);
  if (isError || isRefetchError || isPaused || orgError) {
    return <ErrorComponent refetch={refetch} text={error?.message!} />;
  }

  if (isPending || orgPending) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <HeaderNav title="Complete Request" />
      <CompleteDialog text="Request sent" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={{ marginVertical: 10 }}>
          <UserPreview
            imageUrl={data?.user?.image!}
            name={data?.user?.name}
            roleText={data?.worker?.role}
            workPlace={data?.organization?.name}
            personal
          />
        </View>

        <VStack mt={30} gap={20}>
          <>
            <TouchableOpacity onPress={() => router.push('/staff-role')}>
              <CustomInput
                control={control}
                errors={errors}
                name="role"
                placeholder="Role"
                label="Role"
                editable={false}
              />
            </TouchableOpacity>
          </>

          <CustomInput
            label="Responsibility"
            name={'responsibility'}
            control={control}
            errors={errors}
            placeholder="What will this person do in your workspace?"
            keyboardType="default"
            multiline
            numberOfLines={4}
            textarea
          />

          <CustomInput
            label="Qualities"
            name={'qualities'}
            control={control}
            errors={errors}
            placeholder="What qualities are you looking for?"
            keyboardType="default"
            multiline
            numberOfLines={4}
            textarea
          />

          <VStack>
            <MyText poppins="Bold" style={{ fontFamily: 'NunitoBold' }}>
              Salary
            </MyText>

            <Controller
              control={control}
              name="salary"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  value={+value}
                  onChangeValue={onChange}
                  prefix="₦"
                  delimiter=","
                  separator="."
                  precision={2}
                  minValue={0}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // R$ +2.310,46
                  }}
                  style={styles.numberInput}
                />
              )}
            />
            {errors['salary'] && (
              // @ts-ignore
              <Text style={styles.error}>{errors?.['salary']?.message}</Text>
            )}
          </VStack>
        </VStack>

        <Button
          title={'Send Request'}
          onPress={handleSubmit(onSubmit)}
          loadingTitle={'Sending...'}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: 20 }}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default CompleteRequest;

const styles = StyleSheet.create({
  numberInput: {
    width: '100%',

    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 5,
    height: 55,
  },
  error: {
    fontSize: 15,
    fontFamily: 'NunitoBold',
    color: 'red',
  },
});
