import { QK } from '@/app/api/queryHelpers';
import EditButton from '@/components/form/table-form/EditButton';
import DeckInfo, {
  deckInfoIdentificator,
} from '@/app/(navbar)/(protected)/your/decks/[id]/DeckInfo';
import { useDisclosure } from '@nextui-org/react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

interface DeckInfoModalProps {
  deckId: number;
}

export default function DeckInfoModal({ deckId }: DeckInfoModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <EditButton
        tableId={deckInfoIdentificator}
        id={deckId}
        qk={QK.DECK}
        onPress={onOpen}
        isToggle={false}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent className="p-2 pt-6">
          {onClose => (
            <>
              <ModalBody>
                <DeckInfo deckId={deckId} isAlwaysEditMode={true} />
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
