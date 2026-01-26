import { ErrorBoundaryProps } from 'expo-router';
import { OrganizationModal } from '~/components/OrganizationModal';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { useConnections } from '~/features/common/api/use-connection';
import { useUserData } from '~/features/home/api/user-data';
import { Header } from '~/features/home/components/Header';
import { HomeBody } from '~/features/home/components/home-body';
import { ProfileHeader } from '~/features/home/components/ProfileHeader';
import { useOrganizationModalHook } from '~/features/home/hooks/use-organization-modal';
import { useCustomerSession } from '~/features/payment/hooks/use-customer-session';
import { sliceArray } from '~/lib/helper';

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}

export default function TabOneScreen() {
  const userData = useUserData();
  const connections = useConnections({ ownerId: userData?._id });

  const showModal =
    !!userData && !userData?.organizationId && !userData?.workerId;

  useOrganizationModalHook({ showModal });

  if (userData === undefined || connections === undefined) {
    return <LoadingComponent />;
  }

  const firstTen = sliceArray(connections);
  const headerText = connections.length > 10 ? 'See all connections' : '';
  return (
    <Container>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={userData?._id!}
        avatar={userData?.image!}
        name={userData?.name as string}
      />
      <HomeBody data={firstTen} headerText={headerText} />
    </Container>
  );
}
