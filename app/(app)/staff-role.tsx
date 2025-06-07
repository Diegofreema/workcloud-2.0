import {convexQuery} from "@convex-dev/react-query";
import {Input} from "@rneui/themed";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "expo-router";
import React, {useMemo, useState} from "react";
import {FlatList, Pressable} from "react-native";

import {AddRole} from "~/components/AddRole";
import {HStack} from "~/components/HStack";
import {HeaderNav} from "~/components/HeaderNav";
import {Container} from "~/components/Ui/Container";
import {ErrorComponent} from "~/components/Ui/ErrorComponent";
import {LoadingComponent} from "~/components/Ui/LoadingComponent";
import {MyText} from "~/components/Ui/MyText";
import {api} from "~/convex/_generated/api";
import {useCreateStaffState} from "~/features/staff/hooks/use-create-staff-state";

const StaffRoles = () => {
  const [value, setValue] = useState("");

  const { onGetData } = useCreateStaffState();
  const { data, isPending, isError, refetch, error } = useQuery(
    convexQuery(api.workspace.getRoles, {}),
  );

  const filteredData = useMemo(() => {
    if (value.trim() === "") return data;
    const result = data?.filter((item) =>
      item.role?.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    );
    return [...new Set(result)];
  }, [value, data]);
  const router = useRouter();

  if (isError) {
    return <ErrorComponent refetch={refetch} text={error.message!} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const navigate = async (item: string) => {
    onGetData({ type: "frontier", role: item });
    router.replace("/allStaffs");
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

export default StaffRoles;
