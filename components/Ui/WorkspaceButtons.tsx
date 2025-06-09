import { ActionBtn } from "~/components/Buttons/ActionBtn";
import { HStack } from "~/components/HStack";
import { colors } from "~/constants/Colors";
import { WorkspaceButtonProps } from "~/constants/types";

export const WorkspaceButtons = ({
  onShowModal,
  onProcessors,
  onToggleAttendance,
  loading,
  signedIn,
  disable,
  processorCount,
}: WorkspaceButtonProps) => {
  return (
    <HStack gap={10} mt={15} width="100%">
      <ActionBtn title="Set status" onPress={onShowModal} />
      <ActionBtn
        title="Processors"
        onPress={onProcessors}
        right={processorCount}
        disabled={processorCount === 0}
      />
      <ActionBtn
        title={signedIn ? "Sign out" : "Sign in"}
        isLoading={loading}
        onPress={onToggleAttendance}
        btnStyle={{
          borderColor: signedIn ? "red" : colors.dialPad,
          opacity: disable ? 0.4 : 1,
        }}
        textStyle={{ color: signedIn ? "red" : colors.dialPad }}
        disabled={disable}
      />
    </HStack>
  );
};
