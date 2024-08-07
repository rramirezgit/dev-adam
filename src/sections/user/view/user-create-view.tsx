'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <UserNewEditForm />
    </DashboardContent>
  );
}
