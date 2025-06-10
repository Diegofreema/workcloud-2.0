import React from "react";
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,} from "react-native";
import {Controller, useForm} from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import {colors} from "~/constants/Colors";
import VStack from "~/components/Ui/VStack";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {useRouter} from "expo-router";
import {useStaffStore} from "~/features/staff/store/staff-store";
import {DisplayStaffList} from "~/features/staff/components/display-staff-list";
import {toast} from "sonner-native";
import {useMutation} from "convex/react";
import {api} from "~/convex/_generated/api";
import {useGetUserId} from "~/hooks/useGetUserId";
import {capitaliseFirstLetter, uploadProfilePicture} from "~/lib/helper";

type FormData = {
  groupName: string;
  description?: string;
  image?: string;
};

export const NewGroupForm = () => {
  const router = useRouter();
  const { id } = useGetUserId();
  const clearStaffs = useStaffStore((state) => state.clear);
  const staffs = useStaffStore((state) => state.staffs);
  const createGroup = useMutation(api.conversation.createGroupConversation);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      groupName: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    try {
      const res = await uploadProfilePicture(generateUploadUrl, data.image);
      const groupId = await createGroup({
        name: capitaliseFirstLetter(data.groupName),
        loggedInUserId: id!,
        imageId: res?.storageId,
        otherUsers: staffs.map((s) => s.id),
        description: data.description,
      });
      router.replace(`/chat/group/${groupId}`);
      clearStaffs();
      reset();
      toast.success("Success", {
        description: "Group created successfully",
      });
    } catch (e) {
      console.log(e);
      toast.error("Failed", {
        description: "Could not create group",
      });
    }
  };
  const onPress = () => router.push("/select-staff");
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setValue("image", result.assets[0].uri);
    }
  };
  const disabled = staffs.length === 0 || isSubmitting;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <VStack gap={10} flex={1}>
        <Controller
          control={control}
          render={({ field: { value } }) => (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {value ? (
                <Image source={{ uri: value }} style={styles.imagePreview} />
              ) : (
                <Text style={[styles.imageText]}>
                  Add Group Image (Optional)
                </Text>
              )}
            </TouchableOpacity>
          )}
          name="image"
        />
        <Controller
          control={control}
          rules={{ required: "Group name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Group Name"
              placeholderTextColor={colors.gray}
            />
          )}
          name="groupName"
        />
        {errors.groupName && (
          <Text style={styles.error}>{errors.groupName.message}</Text>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { height: 150, padding: 5 }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description (Optional)"
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={4}
            />
          )}
          name="description"
        />
        <CustomPressable
          style={[
            styles.button,
            { marginTop: 2, backgroundColor: "transparent" },
          ]}
          disable={isSubmitting}
          onPress={onPress}
        >
          <Text style={[styles.buttonText, { color: colors.lightBlue }]}>
            Select staffs
          </Text>
        </CustomPressable>
      </VStack>
      <DisplayStaffList />
      <CustomPressable
        style={styles.button}
        disable={disabled}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Creating..." : "Create"}
        </Text>
      </CustomPressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: colors.grayText,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.gray10,
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderColor: colors.grayText,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: colors.white,
    alignSelf: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  imageText: {
    color: colors.grayText,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.dialPad,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "PoppinsMedium",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
