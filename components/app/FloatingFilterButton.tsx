'use client';

import cn from 'classnames';
import { Button } from '@nextui-org/button';
import { TbDotsVertical, TbMenu2, TbX } from 'react-icons/tb';
import useStore from '@/store/store';
import { LeftMenuType } from '@/store/appSlice';

interface FloatingFilterButtonProps {
  onPress: () => void;
}

export default function FloatingFilterButton({ onPress }: FloatingFilterButtonProps) {
  const isMenuOpen = useStore(state => state.isMenuOpen);

  return (
    <Button
      className={cn('border-1 z-30 fixed bottom-4 right-4 p-2 rounded-full bg-white md:hidden')}
      onPress={onPress}
      isIconOnly
    >
      {isMenuOpen === LeftMenuType.SUBMENU ? <TbX size={20} /> : <TbDotsVertical size={20} />}
    </Button>
  );
}
