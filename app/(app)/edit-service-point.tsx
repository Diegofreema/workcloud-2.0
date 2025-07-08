import { Container } from '~/components/Ui/Container';
import { AuthHeader } from '~/components/AuthHeader';
import { ServicePointForm } from '~/components/Forms/ServicePointForm';
import { useMutation, useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';
import { SchemaType } from '~/validator';
import { toast } from 'sonner-native';
import { generateErrorMessage } from '~/lib/helper';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';

const EditServicePoint = () => {
  const { editId } = useLocalSearchParams<{ editId: Id<'servicePoints'> }>();
  const updateServicePoint = useMutation(api.servicePoints.updateServicePoint);
  const servicePoint = useQuery(
    api.servicePoints.getSingleServicePointAndWorker,
    {
      servicePointId: editId,
    }
  );

  const onSubmit = async (values: SchemaType) => {
    try {
      await updateServicePoint({
        name: values.name,
        servicePointId: editId,
        description: values.description,
        link: values.link,
      });

      toast.success('Success', {
        description: 'Service point updated successfully',
      });

      router.back();
    } catch (error) {
      const errorMessage = generateErrorMessage(
        error,
        'Failed to update service point. Please try again'
      );
      toast.error('Something went wrong', {
        description: errorMessage,
      });
    }
  };
  if (servicePoint === undefined) {
    return <LoadingComponent />;
  }
  if (servicePoint === null) {
    return <Redirect href={'/'} />;
  }
  return (
    <Container>
      <AuthHeader path="Edit Service Point" />
      <ServicePointForm
        onSubmit={onSubmit}
        initialValues={{
          link: servicePoint.externalLink,
          name: servicePoint.name,
          description: servicePoint.description,
          linkText: servicePoint.linkText,
        }}
      />
    </Container>
  );
};
export default EditServicePoint;
