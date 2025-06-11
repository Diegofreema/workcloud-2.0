import { ErrorBoundaryProps } from "expo-router";
import { Header } from "~/features/home/components/Header";
import { OrganizationModal } from "~/components/OrganizationModal";
import { ProfileHeader } from "~/features/home/components/ProfileHeader";
import { Container } from "~/components/Ui/Container";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { useUserData } from "~/features/home/api/user-data";
import { useConnections } from "~/features/common/api/use-connection";
import { useOrganizationModalHook } from "~/features/home/hooks/use-organization-modal";
import { sliceArray } from "~/lib/helper";
import { HomeBody } from "~/features/home/components/home-body";
import { useAuth } from "~/context/auth";

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}

export default function TabOneScreen() {
  const { user } = useAuth();

  const userData = useUserData({ userId: user?.id as string });
  const connections = useConnections({ ownerId: userData?._id });

  const showModal =
    !!userData && !userData?.organizationId && !userData?.workerId;

  useOrganizationModalHook({ showModal });

  if (userData === undefined || connections === undefined) {
    return <LoadingComponent />;
  }

  const firstTen = sliceArray(connections);
  const headerText = connections.length > 10 ? "See all connections" : "";
  return (
    <Container>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={userData?._id!}
        avatar={userData?.imageUrl!}
        name={userData?.name as string}
      />
      <HomeBody data={firstTen} headerText={headerText} />
    </Container>
  );
}
