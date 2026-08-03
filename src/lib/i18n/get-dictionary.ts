import type { Locale } from './config';

const dictionaries = {
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
};

export type Dictionary = typeof import("./dictionaries/en.json");

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries['en'];
  return loader();
}