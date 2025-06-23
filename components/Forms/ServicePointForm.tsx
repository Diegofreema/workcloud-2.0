import {useMutation, useQuery} from "convex/react";
import {router, useLocalSearchParams} from "expo-router";
import React, {useCallback, useState} from "react";
import {toast} from "sonner-native";

import {ServicePointModal} from "../Dialogs/ServicePointModal";
import {InputComponent} from "../InputComponent";
import {MyButton} from "../Ui/MyButton";
import {MyText} from "../Ui/MyText";
import VStack from "../Ui/VStack";
import {api} from "~/convex/_generated/api";
import {Id} from "~/convex/_generated/dataModel";
import {generateErrorMessage} from "~/lib/helper";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {StyleSheet, Text} from "react-native";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "A maximum of 100 characters is allowed")
    .regex(
      /^[a-zA-Z0-9 ]*$/,
      "Only alphanumeric characters and spaces are allowed",
    ),
  description: z
    .string()
    .max(255, "A maximum of 255 characters is allowed")
    .optional(),
  link: z.string().url("Invalid URL, url should contain https://"),
});

type SchemaType = z.infer<typeof schema>;

export const ServicePointForm = () => {

  const { editId } = useLocalSearchParams<{ editId: Id<"servicePoints"> }>();


  const { id } = useLocalSearchParams<{ id: Id<"organizations"> }>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
  } = useForm<SchemaType>({
    defaultValues: {
      link: "",
      name: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      await createServicePoint({
        name: data.name,
        description: data.description,
        organisationId: id,
        link: data.link
      });

      toast.success("Success", {
        description: "Service point created successfully",
      });
      setIsOpen(true);

      router.back();
    } catch (error) {
      const errorMessage = generateErrorMessage(
        error,
        "Failed to create service point. Please try again",
      );
      toast.error("Something went wrong", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const createServicePoint = useMutation(api.servicePoints.createServicePoint);
  const updateServicePoint = useMutation(api.servicePoints.updateServicePoint);
  const servicePoint = useQuery(
    api.servicePoints.getSingleServicePointAndWorker,
    {
      servicePointId: editId,
    },
  );

  const onClose = useCallback(() => setIsOpen(false), []);


  const isDisabled = isSubmitting || loading;

  return (
    <VStack flex={1}>
      <ServicePointModal
        text="Service Point Created"
        isOpen={isOpen}
        onClose={onClose}
      />

      <>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputComponent
              label="Quick point name"
              value={value}
              onChangeText={onChange}
              placeholder="Eg. customers service"
              onBlur={onBlur}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      </>
      <>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputComponent
              label="Description"
              value={value!}
              onChangeText={onChange}
              placeholder="Describe what this service point is for"
              onBlur={onBlur}
              multiline
              textarea

            />
          )}
          name="description"
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}
      </>
      <>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputComponent
              label="Link"
              value={value}
              onChangeText={onChange}
              placeholder="Paste a link for this service point"
              onBlur={onBlur}
              autoCapitalize={'none'}
            />
          )}
          name="link"
        />
        {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}
      </>

      <MyButton
        onPress={handleSubmit(onSubmit)}
        disabled={isDisabled}
        containerStyle={{ marginHorizontal: 10, marginTop: 20 }}
        buttonStyle={{ height: 55, width: "100%" }}
        loading={loading}
      >
        <MyText poppins="Bold" fontSize={15} style={{ color: "white" }}>
          Proceed
        </MyText>
      </MyButton>
    </VStack>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginTop: 2,
    fontFamily: "PoppinsMedium",
  },
});
