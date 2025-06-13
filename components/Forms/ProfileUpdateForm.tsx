import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";
import * as yup from "yup";

import { InputComponent } from "../InputComponent";
import { LoadingComponent } from "../Ui/LoadingComponent";
import { MyButton } from "../Ui/MyButton";
import { MyText } from "../Ui/MyText";
import VStack from "../Ui/VStack";

import { User } from "~/constants/types";
import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";
import { uploadProfilePicture } from "~/lib/helper";
import { Button } from "~/features/common/components/Button";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  avatar: yup.string().required("Profile image is required"),
  phoneNumber: yup.string(),
});
export const ProfileUpdateForm = ({ person }: { person: User }) => {
  const [loading, setLoading] = useState(false);
  const updateUser = useMutation(api.users.updateUserById);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  // const updateImage = useMutation(api.users.updateImage);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const {
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    resetForm,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      date_of_birth: "",
      phoneNumber: "",
      avatar: "",
    },
    validationSchema,
    onSubmit: async () => {
      const { firstName, lastName, phoneNumber } = values;

      const name = `${firstName} ${lastName}`;
      try {
        if (selectedImage) {
          const res = await uploadProfilePicture(
            generateUploadUrl,
            selectedImage.uri,
          );
          if (!res?.storageId) return;
          await updateUser({
            name,
            phoneNumber,
            _id: person._id,
            imageUrl: res.storageId,
          });
        } else {
          await updateUser({
            name,
            phoneNumber,
            _id: person._id,
          });
        }
        resetForm();
        router.back();
      } catch (error: any) {
        toast.error("Error updating profile");

        console.log(error, "Error");
      }
    },
  });

  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (person) {
      setFieldValue("firstName", person?.name?.split(" ")[0]);
      setFieldValue("lastName", person?.name?.split(" ")[1]);
      setFieldValue("email", person?.email);
      setFieldValue("date_of_birth", person.date_of_birth);
      setFieldValue("phoneNumber", person.phoneNumber);
      setFieldValue("avatar", person.imageUrl);
      setFieldValue("phoneNumber", person.phoneNumber);
    }
  }, [person, setFieldValue]);

  const pickImageAsync = async () => {
    setLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
    setLoading(false);
  };

  if (!person) return <LoadingComponent />;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        >
          <Image
            contentFit="cover"
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={{ uri: selectedImage?.uri || person.imageUrl! }}
          />

          {loading ? (
            <ActivityIndicator
              style={[
                styles.abs,
                { backgroundColor: darkMode ? "white" : "black" },
              ]}
              size={20}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.abs,
                { backgroundColor: darkMode ? "white" : "black" },
              ]}
              onPress={pickImageAsync}
            >
              <FontAwesome
                name="plus"
                size={20}
                color={darkMode ? "black" : "white"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
        <MyText style={{ marginBottom: 10 }} poppins="Bold" fontSize={14}>
          User information
        </MyText>

        <VStack gap={10}>
          <>
            <InputComponent
              label="First Name"
              onChangeText={handleChange("firstName")}
              placeholder="First Name"
              autoCapitalize="sentences"
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.firstName}
              </MyText>
            )}
          </>
          <>
            <InputComponent
              label="Last Name"
              onChangeText={handleChange("lastName")}
              placeholder="Last Name"
              value={values.lastName}
              autoCapitalize="sentences"
            />
            {touched.lastName && errors.lastName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.lastName}
              </MyText>
            )}
          </>

          <>
            <InputComponent
              label="Phone Number"
              onChangeText={handleChange("phoneNumber")}
              placeholder="Phone Number"
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.phoneNumber}
              </MyText>
            )}
          </>
        </VStack>

        <View style={{ marginTop: 50 }}>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={() => handleSubmit()}
            title={"Save changes"}
            loadingTitle={"Saving"}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  error: { color: "red", marginTop: 2 },
  date: {
    height: 120,
    marginTop: -10,
  },
  camera: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    width: 20,
    height: 20,
    borderRadius: 9999,
    lineHeight: 20,
    verticalAlign: "middle",
    position: "absolute",
    bottom: 2,
    right: -2,
  },

  phone: {
    width: "100%",
    backgroundColor: "#E9E9E9",
    height: 60,
    paddingHorizontal: 20,

    borderRadius: 2,
  },

  border: {
    borderRadius: 2,
    minHeight: 50,
    alignItems: "center",

    height: 60,
    backgroundColor: "#E9E9E9",
    borderWidth: 0,
  },
  content: {
    paddingLeft: 10,

    width: 60,
    color: "black",
    fontFamily: "PoppinsMedium",
    fontSize: 12,
  },

  container: {
    backgroundColor: "#E9E9E9",
    color: "black",
    fontFamily: "PoppinsMedium",
    marginTop: 10,
  },
  abs: {
    position: "absolute",
    bottom: 0,
    right: 3,

    padding: 5,
    borderRadius: 30,
  },
});
