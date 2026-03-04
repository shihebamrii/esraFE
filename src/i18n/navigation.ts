"use client"
import {createNavigation} from 'next-intl/navigation';
import { locales, localePrefix } from './settings';

 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales, localePrefix});
