import { convexQuery } from "@convex-dev/react-query";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { toast } from "sonner-native";

import { EmptyText } from "~/components/EmptyText";
import { HStack } from "~/components/HStack";
import { Container } from "~/components/Ui/Container";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { MyText } from "~/components/Ui/MyText";
import VStack from "~/components/Ui/VStack";
import { WorkCloudHeader } from "~/components/WorkCloudHeader";
import { WorkspaceItem } from "~/components/WorkspaceItem";
import { colors } from "~/constants/Colors";
import { WorkSpace } from "~/constants/types";
import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useGetUserId } from "~/hooks/useGetUserId";
import { WorkspaceComponent } from "~/features/organization/components/workspace";
import { TabsHeader } from "~/features/common/components/tabs-header";
import { Title } from "~/features/common/components/title";

const Organization = () => {
  const { id, worker } = useGetUserId();
  const { data, isPending, isError, refetch, error } = useQuery(
    convexQuery(api.organisation.getOrganisationsOrNull, { ownerId: id! }),
  );
  const { darkMode } = useDarkMode();
  const {
    data: workspace,
    isPending: isPendingWorkspace,
    isError: isErrorWorkspace,
    refetch: refetchWorkspace,
    error: errorWorkspace,
  } = useQuery(
    convexQuery(api.workspace.getUserWorkspaceOrNull, { workerId: worker! }),
  );

  const handleRefetch = async () => {
    await refetch();
    await refetchWorkspace();
  };

  console.log({ error, errorWorkspace });
  const errorMessage = error?.message || errorWorkspace?.message;
  if (isError || isErrorWorkspace) {
    return (
      <ErrorComponent refetch={handleRefetch} text={errorMessage as string} />
    );
  }
  if (isPending || isPendingWorkspace) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <TabsHeader
        leftContent={<Title title={"Organization"} />}
        rightContent={
          <Pressable
            onPress={() => router.push("/search")}
            style={({ pressed }) => pressed && { opacity: 0.5 }}
          >
            <EvilIcons
              name="search"
              size={30}
              color={darkMode === "dark" ? colors.white : colors.black}
            />
          </Pressable>
        }
      />
      <View style={{ marginVertical: 14 }}>
        {!data?._id ? (
          <WorkCloudHeader />
        ) : (
          <View style={{ gap: 15 }}>
            <WorkspaceItem item={data} onPress={() => router.push(`/my-org`)} />
          </View>
        )}
      </View>

      <View style={{ marginTop: !data ? 20 : 0 }}>
        <MyText
          style={{
            fontSize: 13,
          }}
          poppins="Medium"
        >
          Assigned workspace
        </MyText>

        {workspace?._id ? (
          // @ts-ignore
          <WorkspaceComponent item={workspace} />
        ) : (
          <EmptyText text="No assigned workspace yet" />
        )}
      </View>
    </Container>
  );
};

export default Organization;
