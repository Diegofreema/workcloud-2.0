import { useEffect } from "react";
import { useOrganizationModal } from "~/hooks/useOrganizationModal";
import { Id } from "~/convex/_generated/dataModel";

type Props = {
  data:
    | {
        organizationId: Id<"organizations"> | undefined;
        workerId: Id<"workers"> | undefined;
      }
    | undefined;
};
export const useOrganizationModalHook = ({ data }: Props) => {
  const { onOpen } = useOrganizationModal();

  useEffect(() => {
    if (data !== undefined) {
      if (data.organizationId === undefined && data?.workerId === undefined) {
        onOpen();
      }
    }
  }, [data?.organizationId, data?.workerId, data, onOpen]);
};
