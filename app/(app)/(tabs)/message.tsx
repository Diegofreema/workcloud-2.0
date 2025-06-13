import { Container } from "~/components/Ui/Container";
import { ChatComponent } from "~/features/chat/components/chat.component";
import { TabsHeader } from "~/features/common/components/tabs-header";
import { Title } from "~/features/common/components/title";
import { IconBtn } from "~/features/common/components/icon-btn";
import { BriefcaseBusiness, Plus } from "lucide-react-native";
import { colors } from "~/constants/Colors";
import { router } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { GroupChats } from "~/features/chat/components/group-chats";
import { TabsSelector } from "~/features/common/components/tabs";
import { useState } from "react";

const MessageScreen = () => {
  const { id, workspaceId, role, } = useGetUserId();
  const [selected, setSelected] = useState("Single");
  const staffs = useQuery(
    api.organisation.getStaffsByBossId,
    id ? { bossId: id } : "skip",
  );
  const isProcessor = role === "processor";

  const staffCount = staffs === undefined ? 0 : staffs.length;
  return (
    <Container>
      <TabsHeader leftContent={<Title title={"Messages"} />} />
      <TabsSelector
        data={["Single", "Group"]}
        selected={selected}
        onSelect={(item) => setSelected(item)}
      />
      {selected === "Single" ? <ChatComponent /> : <GroupChats />}

      {staffCount > 0 && (
        <IconBtn
          content={<Plus color={colors.white} />}
          onPress={() => router.push("/new-group")}
        />
      )}
      {workspaceId && !isProcessor && (
        <IconBtn
          content={<BriefcaseBusiness color={colors.white} />}
          onPress={() => router.push(`/wk/${workspaceId}`)}
          style={{ left: 10 }}
        />
      )}
    </Container>
  );
};

export default MessageScreen;
