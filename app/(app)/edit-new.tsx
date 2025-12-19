import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { CompleteDialog } from '~/components/Dialogs/SavedDialog';
import { ProfileUpdateForm } from '~/components/Forms/ProfileUpdateForm';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';

const Edit = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError, refetch } = useQuery(
    convexQuery(api.users.getUserById, { id: id })
  );

  if (isError) {
    return <ErrorComponent refetch={refetch} text={'Something went wrong'} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  if (data === null) return null;
  return (
    <>
      <CompleteDialog text="Changes saved successfully" />
      <Container>
        <HeaderNav title="Edit Profile" />
        <ProfileUpdateForm person={data} />
      </Container>
    </>
  );
};

export default Edit;
