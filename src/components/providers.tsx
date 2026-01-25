'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { UserProgressProvider } from '@/context/user-progress-context'
import { LanguageProvider } from '@/context/language-context'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserProgressProvider>
          {children}
        </UserProgressProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
