import React from "react";
import { Modal } from "antd";
import TransactionPin from "./TransactionPin";
import useAuthStore from "@/Stores/authStore";

interface ManagePinModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: "create" | "update";
}

/**
 * Modal for creating or updating transaction PINs
 */
const ManagePinModal: React.FC<ManagePinModalProps> = ({
  visible,
  onClose,
  mode = "update",
}) => {
  const { user } = useAuthStore();
  const hasPin = user?.has_pin;
  const actualMode = !hasPin ? "create" : mode;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      title={null}
    >
      <TransactionPin
        mode={actualMode}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default ManagePinModal;
