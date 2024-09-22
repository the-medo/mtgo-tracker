import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import React, { cloneElement } from 'react';
import DecksForm from '@/app/(navbar)/(protected)/your/decks/DecksForm';

interface DeckCreationModalProps {
  trigger: React.ReactElement;
}

export default function DeckCreationModal({ trigger }: DeckCreationModalProps) {
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
        <ModalHeader>Create deck</ModalHeader>
        <ModalContent className="p-2 pt-6">
          {() => (
            <>
              <ModalBody>
                <DecksForm />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
