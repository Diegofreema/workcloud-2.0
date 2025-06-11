import { useQuery } from 'convex/react';
import { ErrorBoundaryProps, router, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { ServicePoints } from '~/components/ServicePoints';
import { Container } from '~/components/Ui/Container';
import { DottedButton } from '~/components/Ui/DottedButton';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDetailsToAdd } from '~/hooks/useDetailsToAdd';

export function ErrorBoundary({ retry , error}: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error?.message} />;
}

const Services = () => {
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const { getData } = useDetailsToAdd();
  const servicePoints = useQuery(api.servicePoints.getServicePoints, { organisationId: id });

  const onCreateServicePoint = () => {
    getData({ orgId: id });
    router.push(`/create-service?id=${id}`);
  };

  if (!servicePoints) {
    return <LoadingComponent />;
  }
  return (
    <Container>
      <HeaderNav title="Service point" />
      <HStack justifyContent="center">
        <DottedButton text="Add a Service Point" isIcon onPress={onCreateServicePoint} />
      </HStack>
      <ServicePoints data={servicePoints} />
    </Container>
  );
};

export default Services;
