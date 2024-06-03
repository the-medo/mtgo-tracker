'use client';

import TableFieldString, {
  TableFieldStringProps,
} from '@/components/form/table-form/TableFieldString';
import TableFieldDate, { TableFieldDateProps } from '@/components/form/table-form/TableFieldDate';
import { TableFieldPatchRequest } from '@/components/form/table-form/tableFieldEvents';
import { ReactNode, useCallback } from 'react';
import TableFieldSelect, {
  TableFieldSelectProps,
} from '@/components/form/table-form/TableFieldSelect';
import useSimplePatch from '@/app/api/useSimplePatch';
import { QK } from '@/app/api/queryHelpers';

export type TableFieldProps = {
  tableId: string;
  qk: QK;
  id: number;
  fieldName: string;
  label: string;
  editable?: boolean;
  endContent?: ReactNode;
  onChange?: TableFieldPatchRequest;
  isPending?: boolean;
};

type Props = TableFieldStringProps | TableFieldDateProps | TableFieldSelectProps;

export default function TableField(props: Props) {
  const { mutate } = useSimplePatch(props.qk);

  const onChange = useCallback(
    (id: string | number, field: string, value: string | number) => {
      if (props.onChange) return props.onChange(id, field, value);
      mutate({
        id,
        field,
        value,
      });
    },
    [mutate, props],
  );
  const isPending = props.isPending;

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
