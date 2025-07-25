import { FontAwesome } from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { toast } from "sonner-native";

import { HStack } from "../HStack";
import { MyText } from "../Ui/MyText";

import { colors } from "~/constants/Colors";
import { OwnerType } from "~/constants/types";
import { Id } from "~/convex/_generated/dataModel";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useSelectRow } from "~/hooks/useSelectRow";

const roles = [
  "Manager",
  "Consultant",
  "Team Leader",
  "Business Analyst",
  "Project Manager",
  "Developer",
  "Designer",
  "Dentist",
  "Content Creator",
  "Marketer",
  "Sales Representative",
  "Customer Support",
  "Human Resources Manager",
  "Finance Manager",
  "IT Support Specialist",
  "Operations Manager",
  "Legal Counsel",
  "Quality Assurance Analyst",
  "Data Analyst",
  "Researcher",
  "Trainer",
  "Executive",
  "Agent",
  "Advisor",
  "Therapist",
  "Health Consultant",
  "Entrepreneur",
  "Publicist",
  "Risk Manager",
  "Control",
  "Auditor",
  "Account Officer",
  "Help Desk",
  "Complaint Desk",
  "ICT Support",
  "Customers Support",
];
export const SelectRow = ({
  profile,
}: {
  organizationId: Id<"organizations">;
  profile: OwnerType;
}) => {
  const { isOpen, onClose } = useSelectRow();

  const router = useRouter();
  const { darkMode } = useDarkMode();

  const createWorkspace = async () => {
    if (!profile?.workerId) {
      toast.info("Failed to create workspace", {
        description: "Please create a worker's profile first",
      });
      router.push("/create-worker-profile");
      return;
    }
    try {
      // to create personal workspace then updated organization and user table
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    }
    onClose();
  };

  return (
    <View>
      <Modal
        hasBackdrop={false}
        onDismiss={onClose}
        animationIn="slideInDown"
        isVisible={isOpen}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === "dark" ? "black" : "white",
              shadowColor: darkMode === "dark" ? "#fff" : "#000",
            },
          ]}
        >
          <MyText poppins="Medium" fontSize={15}>
            Select your role
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome
              name="times"
              size={20}
              color={darkMode === "dark" ? "#fff" : "#000"}
            />
          </Pressable>
          <Divider
            style={[
              styles.divider,
              {
                marginBottom: -10,
                backgroundColor: darkMode === "dark" ? "transparent" : "#ccc",
              },
            ]}
          />
          <View style={{ marginTop: 20, width: "100%", gap: 14 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={roles}
              ItemSeparatorComponent={() => (
                <Divider
                  style={[
                    styles.divider,
                    {
                      backgroundColor:
                        darkMode === "dark" ? "transparent" : "#ccc",
                    },
                  ]}
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => createWorkspace()}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    p={10}
                  >
                    <MyText fontSize={13} poppins="Medium">
                      {item}
                    </MyText>
                  </HStack>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: "white",
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 15,
  },
  trash: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
    borderRadius: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
  button: {
    position: "absolute",
    top: 7,
    right: 15,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: "dashed",
  },
});
