'use client';

import { Card, CardBody } from '@nextui-org/card';
import { CardHeader } from '@nextui-org/react';
import Title from '@/components/typography/Title';
import { PropsWithChildren } from 'react';

interface TagAdminBoxProps extends PropsWithChildren {
  title?: string;
}

export default async function TagAdminBox({ title, children }: TagAdminBoxProps) {
  return (
    <Card className="flex-wrap p-4 min-w-[300px] max-w-[500px] flex-grow">
      {title && (
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <Title title={title} />
        </CardHeader>
      )}
      <CardBody className="overflow-visible py-2">{children}</CardBody>
    </Card>
  );
}
