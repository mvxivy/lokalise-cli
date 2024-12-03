import { deepSortObject, flatToJson } from './utils.mjs';
import fsp from 'node:fs/promises';

const parseKeys = (keys) => {
  const translations = {
    en: {},
    ar: {},
  };

  for (const key of keys) {
    const name = key.key_name.web.replace(/::/g, '.');
    for (const translation of key.translations) {
      translations[translation.language_iso][name] = translation.translation;
    }
  }

  return translations;
};

const rawTranslationsToJson = ([lang, flatTranslations]) => {
  const content = flatToJson(flatTranslations);
  const sortedContent = deepSortObject(content);
  return [lang, sortedContent];
};

// TODO: implement content optimization
// const translationOptimization = async (content, required, replace) =>
//   optimizeJson(content, required, replace);

const deployLocales = async (files, outputDir) => {
  const writes = [];
  for (const [key, content] of Object.entries(files)) {
    const promise = fsp.writeFile(`${outputDir}/${key}.json`, JSON.stringify(content, null, 2), {
      encoding: 'utf-8',
    });
    writes.push(promise);
  }
  await Promise.all(writes);
};

/**
 *
 * @param lokalise {LokaliseApi}
 * @param config {ProcessConfig}
 * @returns {Promise<void>}
 */
export const processKeys = async (lokalise, config) => {
  const project = await lokalise.projects().get(config.project_id);

  const pages = Math.ceil(project.statistics.keys_total / config.options.limit);

  const keysRequests = [];
  for (let page = 1; page <= pages; page++) {
    keysRequests.push(lokalise.keys().list({ ...config.options, page }));
  }

  const rawKeys = await Promise.all(keysRequests).then((result) =>
    result.map((keys) => keys.items).flat(),
  );

  const rawTranslations = parseKeys(rawKeys);

  const structuredTranslations = Object.fromEntries(
    Object.entries(rawTranslations).map(rawTranslationsToJson),
  );

  await deployLocales(structuredTranslations, config.outputDir);
};
