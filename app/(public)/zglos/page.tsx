import type { Metadata } from 'next'
import { SeoShell } from '@/components/promos/SeoPromoPage'
import ZglosForm from '@/components/zglos/ZglosForm'
import { seoMetadata } from '@/lib/seoPromos'

// T-096: „Zgłoś biznes do PEDRO” — strona statyczna, formularz wysyła mail przez /api/zglos/
export const metadata: Metadata = seoMetadata(
    '/zglos/',
    'Zgłoś firmę do PEDRO — promocje w Trójmieście',
    'Brakuje tu kogoś? Zgłoś ulubioną firmę albo dodaj swoją — wklej link, a Pedro sprawdzi jej stronę i aktualne promocje.'
)

export default function ZglosPage() {
    return (
        <SeoShell>
            <ZglosForm />
        </SeoShell>
    )
}
