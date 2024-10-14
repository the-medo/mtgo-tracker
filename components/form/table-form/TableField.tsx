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
import { QTypes } from '@/app/api/queryHelpers';
import TableFieldTags, { TableFieldTagsProps } from '@/components/form/table-form/TableFieldTags';
import TableFieldBoolean, {
  TableFieldBooleanProps,
} from '@/components/form/table-form/TableFieldBoolean';
import TableFieldTextarea, {
  TableFieldTextareaProps,
} from '@/components/form/table-form/TableFieldTextarea';

export type TableFieldProps = {
  tableId: string;
  qk: keyof QTypes;
  id: number;
  fieldName: string;
  label: string;
  editable?: boolean;
  isLabelledView?: boolean;
  endContent?: ReactNode;
  onChange?: TableFieldPatchRequest;
  isPending?: boolean;
  customLabel?: ReactNode;
};

type Props =
  | TableFieldStringProps
  | TableFieldTextareaProps
  | TableFieldDateProps
  | TableFieldSelectProps
  | TableFieldTagsProps
  | TableFieldBooleanProps;

export default function TableField(props: Props) {
  const { mutate } = useSimplePatch(props.qk);

  const onChange = useCallback(
    (id: string | number, field: string, value: string | number | boolean) => {
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
    case 'number':
      return <TableFieldString {...props} onChange={onChange} isPending={isPending} />;
    case 'textarea':
      return <TableFieldTextarea {...props} onChange={onChange} isPending={isPending} />;
    case 'date':
      return <TableFieldDate {...props} onChange={onChange} isPending={isPending} />;
    case 'select':
      return <TableFieldSelect {...props} onChange={onChange} isPending={isPending} />;
    case 'tags':
      return <TableFieldTags {...props} onChange={onChange} isPending={isPending} />;
    case 'boolean':
      return <TableFieldBoolean {...props} onChange={onChange} isPending={isPending} />;
    default:
      return 'NOT IMPLEMENTED FIELD TYPE';
  }
}
