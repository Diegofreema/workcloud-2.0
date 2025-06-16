import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner-native";

import { ServicePointModal } from "../Dialogs/ServicePointModal";
import { InputComponent } from "../InputComponent";
import { LoadingComponent } from "../Ui/LoadingComponent";
import { MyButton } from "../Ui/MyButton";
import { MyText } from "../Ui/MyText";
import VStack from "../Ui/VStack";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useSelect } from "~/hooks/useSelect";
import { generateErrorMessage } from "~/lib/helper";

export const ServicePointForm = () => {
  const { onDeselect, onSelect } = useSelect();
  const { editId } = useLocalSearchParams<{ editId: Id<"servicePoints"> }>();

  const [fetching, setFetching] = useState(false);
  const { id } = useLocalSearchParams<{ id: Id<"organizations"> }>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const createServicePoint = useMutation(api.servicePoints.createServicePoint);
  const updateServicePoint = useMutation(api.servicePoints.updateServicePoint);
  const servicePoint = useQuery(
    api.servicePoints.getSingleServicePointAndWorker,
    {
      servicePointId: editId,
    },
  );
  useEffect(() => {
    if (!editId || !servicePoint) return;
    const fetchServicePoint = async () => {
      setFetching(true);
      try {
        if (servicePoint) {
          setValues({
            name: servicePoint.name,
            description: servicePoint.description!,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", {
          description: "Failed to fetch service point. Please try again",
        });
      } finally {
        setFetching(false);
      }
    };
    void fetchServicePoint();
  }, [editId, servicePoint, onSelect]);
  const onClose = useCallback(() => setIsOpen(false), []);

  const [values, setValues] = useState({
    name: "",
    description: "",
  });
  const handleChange = (name: string, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };
  const onChangeStaff = async () => {
    setLoading(true);

    try {
      await updateServicePoint({
        servicePointId: editId,
        name: values.name,
        description: values.description,
      });
      toast.success("Edited successfully");
      router.back();
      onDeselect();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: "Failed to edit. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  const onCreateServicePoint = async () => {
    setLoading(true);
    try {
      await createServicePoint({
        name: values.name,
        description: values.description,
        organisationId: id,
      });

      toast.success("Success", {
        description: "Service point created successfully",
      });
      setIsOpen(true);
      setValues({ name: "", description: "" });
      onDeselect();
      router.back();
    } catch (error) {
      const errorMessage = generateErrorMessage(
        error,
        "Failed to create service point. Please try again",
      );
      toast.error("Something went wrong", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const onAddServicePoint = async () => {
    if (editId) {
      await onChangeStaff();
    } else {
      await onCreateServicePoint();
    }
  };
  if (fetching) return <LoadingComponent />;
  const isDisabled = !values.name || loading;

  return (
    <VStack flex={1}>
      <ServicePointModal
        text="Service Point Created"
        isOpen={isOpen}
        onClose={onClose}
      />

      <>
        <InputComponent
          label="Quick point name"
          value={values.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Eg. customers service"
        />

        <InputComponent
          label="Description"
          value={values.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Describe what this service point is for"
          multiline
          textarea
        />
      </>

      <MyButton
        onPress={onAddServicePoint}
        disabled={isDisabled}
        containerStyle={{ marginHorizontal: 10, marginTop: 20 }}
        buttonStyle={{ height: 55, width: "100%" }}
        loading={loading}
      >
        <MyText poppins="Bold" fontSize={15} style={{ color: "white" }}>
          Proceed
        </MyText>
      </MyButton>
    </VStack>
  );
};
