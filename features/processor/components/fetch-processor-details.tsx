import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SmallLoader } from "~/features/common/components/small-loader";
import { UserPreview } from "~/components/Ui/UserPreview";
import { colors } from "~/constants/Colors";

export const FetchProcessorDetails = () => {
  const { id } = useLocalSearchParams<{ id: Id<"workers"> }>();
  const profileData = useQuery(api.processors.getProcessorDetail, { id });
  if (profileData === undefined) return <SmallLoader />;
  return (
    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 , paddingBottom: 20}}>
      <UserPreview
        name={profileData?.name!}
        roleText={"Processor"}
        imageUrl={profileData?.imageUrl!}
        size={80}
      />
    </View>
  );
};
