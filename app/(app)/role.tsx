import { convexQuery } from '@convex-dev/react-query';
import { Input } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { toast } from 'sonner-native';

import { AddRole } from '~/components/AddRole';
import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { api } from '~/convex/_generated/api';
import { useDetailsToAdd } from '~/hooks/useDetailsToAdd';
import { useGetUserId } from '~/hooks/useGetUserId';

const Role = () => {
  const { getData, personal, setPersonal } = useDetailsToAdd();
  const [value, setValue] = useState('');

  const { organizationId, worker, bossId } = useGetUserId();
  const { data, isPending, isError, refetch, error } = useQuery(
    convexQuery(api.workspace.getRoles, {})
  );
  const createWorkspace = useMutation(api.workspace.createWorkspace);

  const filteredData = useMemo(() => {
    if (value.trim() === '') return data;
    return data?.filter((item) =>
      item.role?.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
  }, [value, data]);
  const router = useRouter();

  if (isError) {
    return <ErrorComponent refetch={refetch} text={error.message!} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const navigate = async (item: string) => {
    if (!organizationId) return;
    if (!worker) {
      router.back();
      return toast.error('Create a worker profile first', {
        description: 'Before creating a workspace',
      });
    }
    if (bossId) {
      router.back();
      return toast.error('Failed to create', {
        description: 'You are already assigned a workspace',
      });
    }
    try {
      const workspaceId = await createWorkspace({
        organizationId,

        type: 'personal',
        role: item,
        workerId: worker,
      });

      router.back();
      getData({ orgId: organizationId!, role: item, workspaceId });
      toast.success('Success', {
        description: personal
          ? 'Personal workspace created'
          : 'Workspace created',
      });
      setPersonal(false);
    } catch (e) {
      console.log(e);
      router.back();
      toast.error('Something went wrong');
    }
  };
  return (
    <Container>
      <HeaderNav title="Select a role" />
      <Input placeholder="Search Role" value={value} onChangeText={setValue} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        // ItemSeparatorComponent={() => <Divider style={[styles.divider]} />}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigate(item.role!)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <HStack justifyContent="space-between" alignItems="center" p={10}>
              <MyText fontSize={13} poppins="Medium">
                {item.role}
              </MyText>
            </HStack>
          </Pressable>
        )}
        ListEmptyComponent={() => <AddRole onNavigate={navigate} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </Container>
  );
};

export default Role;
