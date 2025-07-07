import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";
import * as Crypto from "expo-crypto";
import { WaitListModal } from "~/components/Dialogs/WaitListModal";
import { HeaderNav } from "~/components/HeaderNav";
import { BottomActive } from "~/components/Ui/BottomActive";
import { Container } from "~/components/Ui/Container";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { UserPreview } from "~/components/Ui/UserPreview";
import { Waitlists } from "~/components/Ui/Waitlists";
import { WorkspaceButtons } from "~/components/Ui/WorkspaceButtons";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useGetUserId } from "~/hooks/useGetUserId";
import { useGetWaitlistIdForCustomer } from "~/hooks/useGetWorkspaceIdForCustomer";
import { useWaitlistId } from "~/hooks/useWaitlistId";
import { useGetCustomerId } from "~/hooks/useCustomerId";
import { MessageBtn } from "~/features/common/components/message-btn";
import { useAuth } from "~/context/auth";
import { useStreamVideoClient } from "@stream-io/video-react-bindings";
import { Button } from "~/features/common/components/Button";

const today = format(new Date(), "dd-MM-yyyy");

const Work = () => {
  const { id } = useLocalSearchParams<{ id: Id<"workspaces"> }>();
  const [showMenu, setShowMenu] = useState(false);
  const { id: loggedInUser, user: convexUser } = useGetUserId();
  const { user } = useAuth();
  const client = useStreamVideoClient();
  const [leaving, setLeaving] = useState(false);
  const [customerLeaving, setCustomerLeaving] = useState(false);
  const [customerToRemove, setCustomerToRemove] = useState<Id<"users"> | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingToCall, setAddingToCall] = useState(false);
  const [isLoading] = useState(false);
  const getCustomerId = useGetCustomerId((state) => state.getIds);
  const updateWaitlistType = useMutation(api.workspace.attendToCustomer);
  const setId = useWaitlistId((state) => state.setId);
  const data = useQuery(api.workspace.getWorkspaceWithWaitingList, {
    workspaceId: id,
  });
  const processorCount = useQuery(
    api.processors.getProcessorThroughUser,
    loggedInUser ? { userId: loggedInUser } : "skip",
  );

  const leaveLobby = useMutation(api.workspace.existLobby);
  const handleAttendance = useMutation(api.workspace.handleAttendance);

  const checkIfSignedInToday = useQuery(
    api.workspace.checkIfWorkerSignedInToday,
    {
      workerId: loggedInUser!,
      today,
    },
  );

  const customerWaitlistId = data?.waitlist?.find(
    (w) => w?.customerId === loggedInUser,
  )?._id;
  const isLocked = useMemo(
    () => data?.workspace.locked || false,
    [data?.workspace.locked],
  );
  const isWorker = data?.worker?._id === loggedInUser;
  useGetWaitlistIdForCustomer({ isWorker, waitlistId: customerWaitlistId });
  const isActive = useMemo(() => {
    if (!data || !data?.workspace?.active) return false;
    return data?.workspace?.active;
  }, [data]);
  const isLeisure = useMemo(() => {
    if (!data || !data?.workspace?.leisure) return false;
    return data?.workspace?.leisure;
  }, [data]);

  const isInWaitList = useMemo(() => {
    if (!data) return true;
    return !!data.waitlist.find((w) => w?.customerId === loggedInUser);
  }, [data, loggedInUser]);

  const onLongPress = useCallback(
    (id: Id<"users">) => {
      if (!isWorker) return;
      setCustomerLeaving(false);
      setCustomerToRemove(id);
      setShowMenu(true);
    },
    [isWorker],
  );
  const onHideWaitList = useCallback(() => {
    setShowMenu(false);
  }, []);
  if (isLocked) {
    return <Redirect href="/?locked=locked" />;
  }
  if (!isWorker && !isInWaitList && !customerLeaving) {
    return <Redirect href="/?removed=removed" />;
  }
  if (
    data === undefined ||
    checkIfSignedInToday === undefined ||
    processorCount === undefined
  ) {
    return <LoadingComponent />;
  }
  const modalText = customerLeaving ? "Exist lobby" : "Remove from lobby";
  const hasSignedInToday = checkIfSignedInToday.signedInToday;
  const hasSignedOutToday = checkIfSignedInToday.signedOutToday;
  const attendanceText = hasSignedInToday ? "Sign out" : "Sign in";
  const onRemove = async () => {
    setLeaving(true);
    if (!customerToRemove) return;
    try {
      await leaveLobby({ customerId: customerToRemove!, workspaceId: id });
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from lobby", {
        description: "Something went wrong",
      });
    } finally {
      setLeaving(false);
      setCustomerToRemove(null);
      onHideWaitList();
    }
  };

  const onLeave = async () => {
    setLeaving(true);

    try {
      await leaveLobby({ customerId: loggedInUser!, workspaceId: id });
      toast.success("You have left the lobby", {
        description: "Hope to see you back soon!",
      });
      onHideWaitList();
      router.back();
    } catch (error) {
      console.log(error);
      toast.error("Failed to leave the lobby", {
        description: "Something went wrong",
      });
    } finally {
      setLeaving(false);
    }
  };

  const showModal = () => {
    setIsVisible(true);
  };
  const onProcessors = () => {
    router.push(`/processors/chat`);
  };

  const { workspace, waitlist, organization, worker } = data!;
  const toggleSignIn = async () => {
    setLoading(true);
    if (!loggedInUser) return;
    try {
      if (hasSignedInToday) {
        await handleAttendance({
          workerId: loggedInUser,
          today,
          signOutAt: format(new Date(), "HH:mm:ss"),
          workspaceId: data?.workspace?._id,
        });
      } else {
        await handleAttendance({
          workerId: loggedInUser,
          today,
          signInAt: format(new Date(), "HH:mm:ss"),
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update attendance", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };
  const onClose = () => {
    setIsVisible(false);
  };
  console.log({ workerId: data?.workspace.workerId });
  const onAddToCall = async (
    currentUser: Id<"waitlists">,
    nextUser: Id<"waitlists">,
    customerId: Id<"users">,
    customerCallId: string,
  ) => {
    console.log({ id: user?.id, customerCallId });
    if (!client || !data?.workspace.workerId) return;

    await updateWaitlistType({
      waitlistId: currentUser,
      nextWaitListId: nextUser,
      workerId: data?.workspace.workerId,
    });
    const callId = Crypto.randomUUID();
    await client.call("default", callId).getOrCreate({
      ring: true,
      video: true,
      data: {
        members: [
          { user_id: user?.id!, custom: { convexId: loggedInUser } },
          { user_id: customerCallId, custom: { convexId: customerId } },
        ],
      },
    });
    router.push(
      `/call/${callId}?workerId=${data?.workspace.workerId}&workspaceId=${id}`,
    );
  };
  const handleExit = async () => {
    if (customerLeaving) {
      await onLeave();
    } else {
      await onRemove();
    }
  };
  const onShowExitModal = () => {
    setCustomerLeaving(true);
    setShowMenu(true);
  };

  return (
    <>
      <WaitListModal
        showMenu={showMenu}
        onClose={onHideWaitList}
        onRemove={handleExit}
        text={modalText}
        loading={leaving}
      />
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.container}
        >
          <HeaderNav
            title="Workspace"
            subTitle={`${organization?.name} lobby`}
            rightComponent={<MessageBtn />}
          />
          <View style={{ marginTop: 20 }} />
          <UserPreview
            name={worker?.name}
            imageUrl={worker?.imageUrl!}
            subText={workspace?.role}
            workspace
            active={workspace?.active}
          />
          {isWorker && (
            <WorkspaceButtons
              signedIn={hasSignedInToday}
              attendanceText={attendanceText}
              onShowModal={showModal}
              onProcessors={onProcessors}
              onToggleAttendance={toggleSignIn}
              loading={loading}
              disable={hasSignedOutToday}
              processorCount={processorCount.length}
            />
          )}

          <Waitlists
            waitlists={waitlist}
            isWorker={isWorker}
            onLongPress={onLongPress}
            onAddToCall={onAddToCall}
            isLoading={isLoading}
          />
          {!isWorker && (
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <Button
                title={"Exit Lobby"}
                onPress={onShowExitModal}
                loading={leaving}
              />
            </View>
          )}
          <BottomActive
            id={id}
            onClose={onClose}
            active={isActive}
            leisure={isLeisure}
            isVisible={isVisible}
          />
        </ScrollView>
      </Container>
    </>
  );
};

export default Work;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
