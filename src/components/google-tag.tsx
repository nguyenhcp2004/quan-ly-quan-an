import Script from 'next/script'
import { Fragment } from 'react'
export default function GoogleTag() {
  return (
    <Fragment>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-JY22TM9E7M' />
      <Script
        id='gtag-init'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JY22TM9E7M');
        `
        }}
      />
    </Fragment>
  )
}
