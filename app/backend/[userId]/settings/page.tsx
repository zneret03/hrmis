import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { SettingsForm } from './components/SettingsForm';
import { fetchUser } from '@/services/users/users.services';

import { UpdatePasswordDialog } from '@/app/components/UpdatePasswordDialog';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<JSX.Element> {
  const { userId } = await params;

  const response = await fetchUser(userId);

  return (
    <Container
      title="Settings"
      description="update your personal settings here"
    >
      <main className="mx-auto max-w-4xl">
        <SettingsForm {...response} userId={userId} />
      </main>

      <UpdatePasswordDialog />
    </Container>
  );
}
