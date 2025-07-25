import { useMutation } from "convex/react";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { toast } from "sonner-native";

import { MyButton } from "./Ui/MyButton";
import { MyText } from "./Ui/MyText";

import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";

export const AddRole = ({
  onNavigate,
}: {
  onNavigate: (item: string) => void;
}) => {
  const { darkMode } = useDarkMode();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const addRole = useMutation(api.staff.createStaffRole);

  const onAddRole = async () => {
    if (value === "") return;

    setLoading(true);
    try {
      await addRole({ role: value.charAt(0).toUpperCase() + value.slice(1) });

      onNavigate(value);
      toast.success("Role added successfully");
      setValue("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add role");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ gap: 10, paddingTop: 15 }}>
      <MyText poppins="Medium" fontSize={15}>
        Couldn't find a role
      </MyText>
      <TextInput
        placeholder="Enter a custom one"
        placeholderTextColor={darkMode === "dark" ? "white" : "black"}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
          height: 55,
          borderColor: "gray",
          color: darkMode === "dark" ? "white" : "black",
        }}
        onEndEditing={onAddRole}
        value={value}
        onChangeText={setValue}
      />
      <MyButton
        onPress={onAddRole}
        disabled={value === "" || loading}
        loading={loading}
        buttonStyle={{ width: "100%" }}
      >
        <MyText poppins="Medium" fontSize={15} style={{ color: "white" }}>
          Add
        </MyText>
      </MyButton>
    </View>
  );
};
