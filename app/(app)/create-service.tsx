import { AuthHeader } from "~/components/AuthHeader";
import { ServicePointForm } from "~/components/Forms/ServicePointForm";
import { Container } from "~/components/Ui/Container";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { SchemaType } from "~/validator";
import { toast } from "sonner-native";
import { router, useLocalSearchParams } from "expo-router";
import { generateErrorMessage } from "~/lib/helper";
import { Id } from "~/convex/_generated/dataModel";

const CreateServicePoint = () => {
  const { id } = useLocalSearchParams<{ id: Id<"organizations"> }>();
  const createServicePoint = useMutation(api.servicePoints.createServicePoint);
  const onSubmit = async (data: SchemaType) => {
    try {
      await createServicePoint({
        name: data.name,
        description: data.description,
        organisationId: id,
        link: data.link,
        linkText: data.linkText
      });

      toast.success("Success", {
        description: "Service point created successfully",
      });

      router.back();
    } catch (error) {
      const errorMessage = generateErrorMessage(
        error,
        "Failed to create service point. Please try again",
      );
      toast.error("Something went wrong", {
        description: errorMessage,
      });
    }
  };
  return (
    <Container>
      <AuthHeader path="Create Service Point" />
      <ServicePointForm onSubmit={onSubmit} />
    </Container>
  );
};

export default CreateServicePoint;
