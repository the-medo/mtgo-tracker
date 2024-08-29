import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import React, { cloneElement } from 'react';

interface ConfirmationModalProps {
  trigger: React.ReactElement;
  onConfirm: () => void;
  confirmLoading?: boolean;
  title: string;
  content: React.ReactNode;
}

export default function ConfirmationModal({
  trigger,
  onConfirm,
  confirmLoading,
  title,
  content,
}: ConfirmationModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const clonedTrigger = cloneElement(trigger, {
    onPress: (e: React.MouseEvent) => {
      onOpen();
      if (trigger.props.onPress) {
        trigger.props.onPress(e);
      }
    },
  });

  return (
    <>
      {clonedTrigger}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent className="p-2 pt-6">
          {onClose => (
            <>
              <ModalHeader>{title}</ModalHeader>
              <ModalBody>{content}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={onConfirm}
                  isLoading={confirmLoading}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
