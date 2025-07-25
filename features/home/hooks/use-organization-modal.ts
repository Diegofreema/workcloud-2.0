import { useEffect } from "react";
import { useIsFirstTime } from "~/hooks/use-is-first-time";
import { useOrganizationModal } from "~/hooks/useOrganizationModal";

type Props = {
  showModal: boolean;
};
export const useOrganizationModalHook = ({ showModal }: Props) => {
  const { onOpen } = useOrganizationModal();
  const isFirstTime = useIsFirstTime((state) => state.isFirstTime);
  useEffect(() => {
    if (!isFirstTime) {
      return;
    }
    if (showModal) {
      onOpen();
    }
  }, [showModal, onOpen, isFirstTime]);
};
