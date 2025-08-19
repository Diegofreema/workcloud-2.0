import React, { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '~/features/common/components/Button';
import { schema, SchemaType } from '~/validator';
import { ServicePointModal } from '../Dialogs/ServicePointModal';
import { CustomInput } from '../InputComponent';
import VStack from '../Ui/VStack';

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
      link: '',
      name: '',
      description: '',
      linkText: '',
      ...initialValues,
    },
    resolver: zodResolver(schema),
  });
  const { link, name, description, linkText } = watch();

  const onClose = useCallback(() => setIsOpen(false), []);
  const disable =
    (!!initialValues &&
      initialValues.name === name &&
      initialValues.description === description &&
      initialValues.link === link &&
      initialValues.linkText === linkText) ||
    isSubmitting;
  return (
    <VStack flex={1}>
      <ServicePointModal
        text="Service Point Created"
        isOpen={isOpen}
        onClose={onClose}
      />

      <CustomInput
        name="name"
        control={control}
        errors={errors}
        label="Quick point name"
        placeholder="Eg. customers service"
      />

      <CustomInput
        label="Description"
        name={'description'}
        placeholder="Describe what this service point is for"
        multiline
        textarea
        control={control}
        errors={errors}
      />

      <CustomInput
        label="Link"
        control={control}
        errors={errors}
        placeholder="Paste a link for this service point"
        autoCapitalize={'none'}
        name="link"
      />

      <CustomInput
        label="Link Text"
        control={control}
        errors={errors}
        placeholder="Add a text for this link"
        autoCapitalize={'none'}
        name="linkText"
      />

      <Button
        title={'Submit'}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={disable}
        loadingTitle={'Submitting...'}
        style={{ height: 55, marginTop: 20 }}
      />
    </VStack>
  );
};
