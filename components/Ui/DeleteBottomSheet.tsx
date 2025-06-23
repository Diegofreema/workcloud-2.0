import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button } from "@rneui/themed";
import { useMutation } from "convex/react";
import { forwardRef, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { toast } from "sonner-native";

import { HStack } from "~/components/HStack";
import { MyText } from "~/components/Ui/MyText";
import { colors } from "~/constants/Colors";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useDarkMode } from "~/hooks/useDarkMode";
import { generateErrorMessage } from "~/lib/helper";

type Props = {
  onClose: () => void;
  id: Id<"servicePoints">;
};
type RefProps = BottomSheet;
export const DeleteBottomSheet = forwardRef<RefProps, Props>(
  ({ id, onClose }, ref) => {
    const snapPoints = useMemo(() => ["25%"], []);
    const [isLoading, setIsLoading] = useState(false);
    const deleteServicePoint = useMutation(
      api.servicePoints.deleteServicePoint,
    );
    const { darkMode } = useDarkMode();
    const onPress = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        await deleteServicePoint({ id });
        toast.success("Success", {
          description: "Service point deleted successfully.",
        });
        onClose();
      } catch (e) {
        const errorMessage = generateErrorMessage(
          e,
          "Something went wrong, Please try again later.",
        );
        toast.error("Error", {
          description: errorMessage,
        });
        onClose();
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetView
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === "dark" ? "black" : "white",
              shadowColor: darkMode === "dark" ? "#fff" : "#000",
            },
          ]}
        >
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{
              textAlign: "center",
              marginBottom: 15,
              color: darkMode === "dark" ? "white" : "black",
            }}
          >
            Are you sure you want to delete this service point?
          </MyText>

          <HStack gap={10}>
            <Button
              disabled={isLoading}
              loading={isLoading}
              titleStyle={{ fontFamily: "PoppinsMedium" }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onPress}
            >
              Yes
            </Button>
            <Button
              titleStyle={{
                fontFamily: "PoppinsMedium",
                color: colors.dialPad,
              }}
              buttonStyle={{
                backgroundColor: colors.lightBlueButton,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onClose}
              color={colors.black}
            >
              No
            </Button>
          </HStack>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

DeleteBottomSheet.displayName = "DeleteBottomSheet";

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",

    borderRadius: 15,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
