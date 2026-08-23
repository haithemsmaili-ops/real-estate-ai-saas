import type { Locale } from './config';

const dictionaries = {
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export type Dictionary = Record<string, any>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries['ar'];
  return loader();
}