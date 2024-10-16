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
import { useLocale, useTranslations } from 'next-intl'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
export function SwitchLanguage() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const pathName = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        const locale = params.locale as Locale
        const newPathName = pathName.replace(`/${locale}`, `/${value}`)
        const fullUrl = `${newPathName}?${searchParams.toString()}`
        router.push(fullUrl)
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
