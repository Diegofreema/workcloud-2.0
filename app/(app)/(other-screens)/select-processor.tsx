import {Container} from "~/components/Ui/Container";
import {HeaderNav} from "~/components/HeaderNav";
import {useLocalSearchParams} from "expo-router";
import {Id} from "~/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {Alert, FlatList} from "react-native";
import {LoadingComponent} from "~/components/Ui/LoadingComponent";
import {UserPreview} from "~/components/Ui/UserPreview";
import {FunctionReturnType} from "convex/server";
import {EmptyText} from "~/components/EmptyText";
import {toast} from "sonner-native";
import {generateErrorMessage} from "~/lib/helper";

const SelectProcessor = () => {
  const { workspaceId, id } = useLocalSearchParams<{
    workspaceId: Id<"workspaces">;
    id: Id<"stars">;
  }>();
  const data = useQuery(api.processors.getProcessorsThroughWorkpaceId, {
    workspaceId,
  });

  if (data === undefined) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <HeaderNav title={"Choose Processor"} />
      <FlatList
        data={data}
        renderItem={({ item }) => <Processor item={item} starId={id} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15, paddingBottom: 50 }}
        ListEmptyComponent={<EmptyText text={"No processors found"} />}
      />
    </Container>
  );
};
export default SelectProcessor;

type ProcessorType = {
  item: FunctionReturnType<
    typeof api.processors.getProcessorsThroughWorkpaceId
  >[number];
  starId: Id<"stars">;
};

const Processor = ({ item, starId }: ProcessorType) => {
    const assignTo = useMutation(api.processors.assignProcessorStarred);

  const onHandleAssign = async () => {
    try {
        await assignTo({
            starId,
            id: item._id!
        })
        toast.success('Success', {
            description: 'You have assigned this to' + item.name
        })
    } catch (error) {
        const errorMessage = generateErrorMessage(error, 'Failed to assign processor');
        toast.error("Error", {
            description: errorMessage,
        });
    }
  };
  const onPress = () => {
    Alert.alert("Are you sure?", "Please make sure before clicking continue", [
      { text: "Cancel", onPress: () => {} },
      { text: "Continue", onPress: onHandleAssign },
    ]);
  };
  return (
    <UserPreview
      imageUrl={item?.image}
      name={item?.name}
      subText={item?.role}
      onPress={onPress}
    />
  );
};
