import { JSX } from 'react'
import { Container } from '@/components/custom/Container'
import { SettingsForm } from './components/SettingsForm'
import { fetchUser } from '@/services/users/users.services'

export default async function SettingsPage({
  params
}: {
  params: Promise<{ userId: string }>
}): Promise<JSX.Element> {
  const { userId } = await params

  const response = await fetchUser(userId)

  return (
    <Container
      title='Settings'
      description='update your personal settings here'
    >
      <main className='max-w-4xl mx-auto'>
        <SettingsForm {...response} userId={userId} />
      </main>
    </Container>
  )
}
