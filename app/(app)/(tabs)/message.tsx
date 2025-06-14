import { Container } from "~/components/Ui/Container";
import { ChatComponent } from "~/features/chat/components/chat.component";
import { TabsHeader } from "~/features/common/components/tabs-header";
import { Title } from "~/features/common/components/title";
import { IconBtn } from "~/features/common/components/icon-btn";
import { Plus } from "lucide-react-native";
import { colors } from "~/constants/Colors";
import { router } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { GroupChats } from "~/features/chat/components/group-chats";
import { TabsSelector } from "~/features/common/components/tabs";
import { useState } from "react";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const Components = [ChatComponent, GroupChats];
const MessageScreen = () => {
  const { id } = useGetUserId();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ActiveComponents = Components[selectedIndex];

  const staffs = useQuery(
    api.organisation.getStaffsByBossId,
    id ? { bossId: id } : "skip",
  );

  const staffCount = staffs === undefined ? 0 : staffs.length;
  const onSwipeLeft = () => {
    if (selectedIndex === 0) return;
    setSelectedIndex(0);
  };
  const onSwipeRight = () => {
    if (selectedIndex === 1) return;
    setSelectedIndex(1);
  };

  const swipe = Gesture.Simultaneous(
    Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => {
        runOnJS(onSwipeLeft)();
      }),
    Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => {
        runOnJS(onSwipeRight)();
      }),
  );
  return (
    <GestureDetector gesture={swipe}>
      <Container>
        <TabsHeader leftContent={<Title title={"Messages"} />} />
        <TabsSelector
          data={["Single", "Group"]}
          selectedIndex={selectedIndex}
          onSelectIndex={(index) => setSelectedIndex(index)}
        />
        <ActiveComponents />

        {staffCount > 0 && (
          <IconBtn
            content={<Plus color={colors.white} />}
            onPress={() => router.push("/new-group")}
          />
        )}
      </Container>
    </GestureDetector>
  );
};

export default MessageScreen;
