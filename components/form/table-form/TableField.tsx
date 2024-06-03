'use client';

import TableFieldString, {
  TableFieldStringProps,
} from '@/components/form/table-form/TableFieldString';
import TableFieldDate, { TableFieldDateProps } from '@/components/form/table-form/TableFieldDate';
import {
  getPatchRequest,
  TableFieldPatchRequest,
} from '@/components/form/table-form/tableFieldEvents';
import { ReactNode, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import TableFieldSelect, {
  TableFieldSelectProps,
} from '@/components/form/table-form/TableFieldSelect';

export type TableFieldProps = {
  tableId: string;
  path: string;
  id: number;
  fieldName: string;
  label: string;
  editable?: boolean;
  endContent?: ReactNode;
  onChange?: TableFieldPatchRequest;
  isPending?: boolean;
};

type Props = TableFieldStringProps | TableFieldDateProps | TableFieldSelectProps;

//type: 'number' | 'string' | 'select' | 'toggle' | 'date';

export default function TableField(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onChange = useCallback(
    props.onChange ?? getPatchRequest(props.path, router, startTransition),
    [router, props.path, props.onChange],
  );
  const isPending = props.isPending ?? pending;

  switch (props.type) {
    case 'string':
      return <TableFieldString {...props} onChange={onChange} isPending={isPending} />;
    case 'date':
      return <TableFieldDate {...props} onChange={onChange} isPending={isPending} />;
    case 'select':
      return <TableFieldSelect {...props} onChange={onChange} isPending={isPending} />;
  }

  return <></>;
}
