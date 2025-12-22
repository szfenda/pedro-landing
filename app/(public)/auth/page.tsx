import AuthCard from '@/components/auth/AuthCard'
import AuthShell from '@/components/auth/AuthShell'

export const metadata = {
  title: 'PEDRO - Logowanie',
  description: 'Zaloguj się do PEDRO i wróć do polowania na promki.',
}

export default function AuthPage() {
  return (
    <AuthShell>
      <AuthCard />
    </AuthShell>
  )
}