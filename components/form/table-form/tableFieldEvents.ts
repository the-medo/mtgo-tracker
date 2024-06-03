import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { TransitionStartFunction } from 'react';

export type TableFieldPatchRequest = (
  id: string | number,
  field: string,
  value: string | number,
) => void;

export type TableFieldDeleteRequest = (id: string | number) => void;

export const getPatchRequest =
  (
    path: string,
    router: AppRouterInstance,
    startTransition: TransitionStartFunction,
  ): TableFieldPatchRequest =>
  async (id: string | number, field: string, value: string | number) => {
    startTransition(async () => {
      const res = await fetch(`/api/${path}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          [field]: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      router.refresh();
    });
  };

export const getDeleteRequest =
  (
    path: string,
    router: AppRouterInstance,
    startTransition: TransitionStartFunction,
  ): TableFieldDeleteRequest =>
  async (id: string | number) => {
    startTransition(async () => {
      const res = await fetch(`/api/${path}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      router.refresh();
    });
  };
