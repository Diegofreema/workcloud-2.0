import { convexQuery } from "@convex-dev/react-query";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CompleteDialog } from "~/components/Dialogs/SavedDialog";
import { HeaderNav } from "~/components/HeaderNav";
import { CustomInput } from "~/components/InputComponent";
import { Container } from "~/components/Ui/Container";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { UserPreview } from "~/components/Ui/UserPreview";
import VStack from "~/components/Ui/VStack";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/features/common/components/Button";
import { useCreateStaffState } from "~/features/staff/hooks/use-create-staff-state";
import { offerSchema, OfferSchemaType } from "~/schema";
import { sendPushNotification } from "~/utils/sendPushNotification";

const CompleteRequest = () => {
  const { id } = useLocalSearchParams<{ id: Id<"workers"> }>();

  const { staffData } = useCreateStaffState();
  const finalRole =
    staffData?.type === "processor" ? staffData.type : staffData.role;

  const router = useRouter();
  const { data, isPaused, isPending, isError, refetch, isRefetchError, error } =
    useQuery(convexQuery(api.worker.getSingleWorkerProfile, { id }));
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
      role: "",
      responsibility: "",
      salary: "",
      qualities: "",
    },
    resolver: zodResolver(offerSchema),
  });
  const onSubmit = async (values: OfferSchemaType) => {
    const { responsibility, salary, qualities, role } = values;
    if (!data?.user) return;
    try {
      await sendRequest({
        role,
        salary,
        qualities,
        responsibility,
        from: orgData?.ownerId!,
        to: data?.user?._id,
      });
      await sendPushNotification({
        title: "Offer Request",
        body: `${orgData?.name} sent you an offer request`,
        data: {
          type: "notification",
        },
        expoPushToken: data.user.pushToken!,
      });
      toast.success("Request sent");
      reset();
      router.replace("/pending-staffs");
    } catch (error) {
      console.log(error);
      toast.error("Error, failed to send request");
    }
  };

  useEffect(() => {
    if (finalRole) {
      setValue("role", finalRole);
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
      <ScrollView
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
            <TouchableOpacity onPress={() => router.push("/staff-role")}>
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
            name={"responsibility"}
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
            name={"qualities"}
            control={control}
            errors={errors}
            placeholder="What qualities are you looking for?"
            keyboardType="default"
            multiline
            numberOfLines={4}
            textarea
          />

          <CustomInput
            label="Salary"
            name={"salary"}
            control={control}
            errors={errors}
            placeholder="Type a salary in naira"
            keyboardType="number-pad"
          />
        </VStack>

        <Button
          title={"Send Request"}
          onPress={handleSubmit(onSubmit)}
          loadingTitle={"Sending..."}
          loading={isSubmitting}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </Container>
  );
};

export default CompleteRequest;
