import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import React, { cloneElement } from 'react';
import EventsForm from '@/app/(navbar)/(protected)/your/events/EventsForm';

interface EventCreationModalProps {
  trigger: React.ReactElement;
}

export default function EventCreationModal({ trigger }: EventCreationModalProps) {
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
        <ModalHeader>Create event</ModalHeader>
        <ModalContent className="p-2 pt-6">
          {() => (
            <>
              <ModalBody>
                <EventsForm />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
