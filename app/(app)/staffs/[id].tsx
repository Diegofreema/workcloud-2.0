import {BottomSheet, Divider} from "@rneui/themed";
import {useMutation, useQuery} from "convex/react";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useMemo, useState} from "react";
import {FlatList, Pressable, StyleSheet, View} from "react-native";
import {toast} from "sonner-native";

import {AuthHeader} from "~/components/AuthHeader";
import {AddStaff, Menu} from "~/components/Dialogs/AddStaff";
import {AddToWorkspace} from "~/components/Dialogs/AddToWorkspace";
import {RemoveUser} from "~/components/Dialogs/RemoveUser";
import {SelectNewRow} from "~/components/Dialogs/SelectNewRow";
import {EmptyText} from "~/components/EmptyText";
import {HStack} from "~/components/HStack";
import {Container} from "~/components/Ui/Container";
import {DottedButton} from "~/components/Ui/DottedButton";
import {LoadingComponent} from "~/components/Ui/LoadingComponent";
import {MyText} from "~/components/Ui/MyText";
import {colors} from "~/constants/Colors";
import {api} from "~/convex/_generated/api";
import {Id} from "~/convex/_generated/dataModel";
import {useDarkMode} from "~/hooks/useDarkMode";
import {useHandleStaff} from "~/hooks/useHandleStaffs";
import {ActionButton} from "~/components/ActionButton";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {CustomModal} from "~/features/workspace/components/modal/custom-modal";
import {RFPercentage} from "react-native-responsive-fontsize";
import {useWorkspaceModal} from "~/features/workspace/hooks/use-workspace-modal";
import {StaffRoles} from "~/features/staff/components/staff-roles";
import {useCreateStaffState} from "~/features/staff/hooks/use-create-staff-state";
import {ProcessorType, StaffType} from "~/features/staff/type";
import {LoadingModal} from "~/features/common/components/loading-modal";
import {StaffLists} from "~/features/staff/components/staff-lists";

const Staffs = () => {
  const { id } = useLocalSearchParams<{ id: Id<"users"> }>();

  const [showBottom, setShowBottom] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<Id<"workspaces"> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { getItem, item: staff } = useHandleStaff();
  const { onClose, isOpen, onOpen } = useWorkspaceModal();

  const [role, setRole] = useState("All");
  const router = useRouter();
  const roles = useQuery(api.staff.getStaffRoles, { bossId: id });
  const data = useQuery(api.organisation.getStaffsByBossId, { bossId: id! });
  const workspaces = useQuery(api.workspace.freeWorkspaces, { ownerId: id });
  const { darkMode } = useDarkMode();
  const { onGetData } = useCreateStaffState();
  const addToWorkspace = useMutation(api.workspace.addStaffToWorkspace);
  const createWorkspace = useMutation(api.workspace.createAndAssignWorkspace);

  const workers = useMemo(() => {
    if (!data) return [];
    if (role === "All") {
      return data;
    }

    return data?.filter((worker) => worker.role === role);
  }, [data, role]);

  if (!data || !roles || !workspaces) {
    return <LoadingComponent />;
  }

  const onShowBottom = () => setShowBottom(true);
  const onHideBottom = () => setShowBottom(false);

  const pendingStaffs = () => {
    router.push("/pending-staffs");
  };

  const showMenu = (item: ProcessorType) => {
    setIsVisible(true);
    getItem(item);
  };
  const onCreate = async () => {
    if (!staff) return;
    setAssigning(true);
    try {
      await createWorkspace({
        organizationId: staff?.organizationId!,
        ownerId: id,
        type: "front",
        role: staff?.role!,
        workerId: staff?._id,
      });
      onHideBottom();
      toast.success("Workspace created and assigned to staff");
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Something went wrong",
      });
    } finally {
      setAssigning(false);
    }
  };

  const array = [
    {
      icon: "user-o",
      text: "View profile",
    },
    {
      icon: "send-o",
      text: "Send message",
    },

    staff?.workspaceId
      ? {
          icon: staff?.workspace?.locked ? "unlock-alt" : "lock",
          text: staff?.workspace?.locked
            ? "Unlock workspace"
            : "Lock workspace",
        }
      : {
          icon: "industry",
          text: "Assign workspace",
        },
    staff?.workspaceId && {
      icon: "trash-o",
      text: "Remove staff",
    },
  ];
  const onBottomOpen = () => {
    setIsVisible(false);
    onShowBottom();
  };
  const onAddStaff = (id: Id<"workspaces">) => {
    setWorkspaceId(id);
    setShowModal(true);
    onHideBottom();
  };
  // to update with convex function
  const handleAdd = async () => {
    setLoading(true);
    if (!workspaceId) return;
    try {
      await addToWorkspace({ workspaceId, workerId: staff?._id! });
      toast.success("Success", {
        description: "Staff added successfully",
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelect = (value: StaffType) => {
    if (value === "frontier") {
      onGetData({ type: value, role: null });
      router.push("/staff-role");
    } else {
      onGetData({ type: value, role: "processor" });
      router.push("/allStaffs");
    }
    onClose();
  };
  const options = [
    {
      title: "Open Workspace",
      onPress: () => handleSelect("frontier"),
    },
    { title: "Processor workspace", onPress: () => handleSelect("processor") },
  ];
  const workersData = workers.map(
    ({ user, role, organizationId, workspace, workspaceId, _id }) => ({
      id: user?._id!,
      name: user?.name!,
      image: user?.imageUrl!,
      role: role!,
      organizationId,
      workspace,
      workspaceId,
      _id,
    }),
  );
  return (
    <Container>
      <LoadingModal isOpen={assigning} />
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={"Assign workspace function"}
      >
        {options.map((item) => (
          <CustomPressable
            onPress={item.onPress}
            style={styles.option}
            key={item.title}
          >
            <MyText poppins={"Light"} fontSize={RFPercentage(1.5)}>
              {item.title}
            </MyText>
          </CustomPressable>
        ))}
      </CustomModal>
      <AddStaff />
      <RemoveUser />
      <AddToWorkspace
        loading={loading}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
      <Menu
        onBottomOpen={onBottomOpen}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        userId={staff?.id!}
        // @ts-ignore
        array={array}
        bossId={id}
      />
      <SelectNewRow id={id} />
      <AuthHeader path="Staffs" />
      <View style={{ marginBottom: 15 }}>
        <StaffRoles roles={roles} setRole={setRole} role={role} />
        <HStack gap={10} justifyContent="center">
          <DottedButton text="Add New Staff" onPress={onOpen} />
          <DottedButton
            isIcon={false}
            text="Pending Staffs"
            onPress={pendingStaffs}
          />
        </HStack>
      </View>
      <StaffLists data={workersData} showMenu={showMenu} />
      <BottomSheet
        modalProps={{}}
        onBackdropPress={onHideBottom}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          style: {
            backgroundColor: darkMode === "dark" ? "black" : "white",
            padding: 10,
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            height: "40%",
          },
          contentContainerStyle: {
            height: "100%",
          },
        }}
        isVisible={showBottom}
      >
        <FlatList
          style={{ marginTop: 30 }}
          ListHeaderComponent={() => (
            <ActionButton onPress={onCreate} style={{ marginBottom: 5 }} />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 1,
                backgroundColor: darkMode === "dark" ? "transparent" : "#ccc",
                width: "100%",
              }}
            />
          )}
          data={workspaces}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onAddStaff(item._id)}
              disabled={loading}
              style={({ pressed }) => [
                { opacity: pressed || loading ? 0.5 : 1 },
                styles.pressed,
              ]}
            >
              <MyText poppins="Medium" fontSize={20}>
                {item.role}
              </MyText>
            </Pressable>
          )}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <EmptyText text="No empty workspaces found" />
          )}
          contentContainerStyle={{ gap: 15 }}
        />
      </BottomSheet>
    </Container>
  );
};

export default Staffs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pressed: {
    padding: 5,
  },
  option: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 2,
    // paddingVertical: 10,
    padding: 20,
  },
});
