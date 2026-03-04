import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async (params: any) => {
  const locale = (await params.requestLocale) || params.locale || 'fr';
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});


