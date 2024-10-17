'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function SwitchLanguage() {
  return (
    <Suspense>
      <SwitchLanguageMain />
    </Suspense>
  )
}
export function SwitchLanguageMain() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const pathName = usePathname()
  const router = useRouter()
  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        router.replace(pathName, { locale: value as Locale })
        router.refresh()
      }}
    >
      <SelectTrigger className='w-[140px]'>
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
