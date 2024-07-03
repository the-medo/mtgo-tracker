import { QK } from '@/app/api/queryHelpers';
import EditButton from '@/components/form/table-form/EditButton';
import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import EventInfo, {
  eventInfoIdentificator,
} from '@/app/(navbar)/(protected)/your/events/[id]/EventInfo';

interface EventInfoModalProps {
  eventId: number;
}

export default function EventInfoModal({ eventId }: EventInfoModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <EditButton
        tableId={eventInfoIdentificator}
        id={eventId}
        qk={QK.EVENT}
        onPress={onOpen}
        isToggle={false}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent className="p-2 pt-6">
          {onClose => (
            <>
              <ModalBody>
                <EventInfo eventId={eventId} isAlwaysEditMode={true} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
