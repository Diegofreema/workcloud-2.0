import React, { useCallback, useState } from "react";

import { ServicePointModal } from "../Dialogs/ServicePointModal";
import { InputComponent } from "../InputComponent";
import VStack from "../Ui/VStack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import { schema, SchemaType } from "~/validator";
import { Button } from "~/features/common/components/Button";

type Props = {
  onSubmit: (data: SchemaType) => void;
  initialValues?: SchemaType;
};

export const ServicePointForm = ({ onSubmit, initialValues }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    watch,
  } = useForm<SchemaType>({
    defaultValues: {
      link: "",
      name: "",
      description: "",
      linkText: "",
      ...initialValues,
    },
    resolver: zodResolver(schema),
  });
  const { link, name, description } = watch();

  const onClose = useCallback(() => setIsOpen(false), []);
  const disable =
    (!!initialValues &&
      initialValues.name === name &&
      initialValues.description === description &&
      initialValues.link === link) ||
    isSubmitting;
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
              value={value!}
              onChangeText={onChange}
              placeholder="Paste a link for this service point"
              onBlur={onBlur}
              autoCapitalize={"none"}
            />
          )}
          name="link"
        />
        {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}
      </>
      <>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputComponent
              label="Link Text"
              value={value!}
              onChangeText={onChange}
              placeholder="Add a text for this link"
              onBlur={onBlur}
              autoCapitalize={"none"}
            />
          )}
          name="linkText"
        />
        {errors.linkText && (
          <Text style={[styles.error]}>{errors.linkText.message}</Text>
        )}
      </>

      <Button
        title={"Submit"}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={disable}
        loadingTitle={"Submitting..."}
        style={{ height: 55, marginHorizontal: 10 }}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginTop: 2,
    fontFamily: "PoppinsMedium",
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
