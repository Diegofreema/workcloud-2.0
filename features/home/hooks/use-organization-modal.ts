import {useEffect} from "react";
import {useOrganizationModal} from "~/hooks/useOrganizationModal";

type Props = {
  showModal: boolean;
};
export const useOrganizationModalHook = ({ showModal }: Props) => {
  const { onOpen } = useOrganizationModal();

  useEffect(() => {
    if (showModal) {
      onOpen();
    }
  }, [showModal, onOpen]);
};
