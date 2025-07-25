import { EvilIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import { EmptyText } from "~/components/EmptyText";
import { Container } from "~/components/Ui/Container";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { MyText } from "~/components/Ui/MyText";
import { WorkCloudHeader } from "~/components/WorkCloudHeader";
import { WorkspaceItem } from "~/components/WorkspaceItem";
import { colors } from "~/constants/Colors";
import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useGetUserId } from "~/hooks/useGetUserId";
import { WorkspaceComponent } from "~/features/organization/components/workspace";
import { TabsHeader } from "~/features/common/components/tabs-header";
import { Title } from "~/features/common/components/title";

const Organization = () => {
  const { worker } = useGetUserId();
  const data = useQuery(api.organisation.getOrganisationsOrNull, {});
  const { darkMode } = useDarkMode();
  const workspace = useQuery(api.workspace.getUserWorkspaceOrNull, {
    workerId: worker,
  });

  if (data === undefined || workspace === undefined) {
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
            marginBottom: 20,
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
