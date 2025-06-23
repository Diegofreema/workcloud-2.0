import { Avatar } from "@rneui/themed";
import { Pressable } from "react-native";

import { MyText } from "~/components/Ui/MyText";
import VStack from "~/components/Ui/VStack";
import { WaitList } from "~/constants/types";
import { Id } from "~/convex/_generated/dataModel";
import { convertStringToDate } from "~/lib/helper";

export const Profile = ({
  item,
  onAddToCall,
  onLongPress,
  isLoading,
}: {
  item: WaitList;
  onAddToCall: (
    id: Id<"waitlists">,
    customerId: Id<"users">,
    customerCallId: string,
  ) => void;
  onLongPress: () => void;
  isLoading: boolean;
}) => {
  const date = convertStringToDate(item?.joinedAt);

  return (
    <Pressable
      disabled={isLoading}
      style={{ width: "30%" }}
      onPress={() =>
        onAddToCall(item?._id, item?.customerId, item?.customer?.clerkId!)
      }
      onLongPress={onLongPress}
    >
      <VStack flex={1} alignItems="center" justifyContent="center">
        <Avatar rounded size={50} source={{ uri: item?.customer?.imageUrl! }} />
        <MyText poppins="Medium" fontSize={13}>
          {item?.customer?.name.split(" ")[0]}
        </MyText>
        <MyText poppins="Light" fontSize={10} style={{ textAlign: "center" }}>
          {date}
        </MyText>
      </VStack>
    </Pressable>
  );
};
