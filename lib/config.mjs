import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

const defaultOptions = {
  keys: {
    include_translations: 1,
    filter_archived: 'exclude',
    limit: 500,
  },
  files: {
    format: 'json',
    bundle_structure: '%LANG_ISO%.%FORMAT%',
    export_sort: 'a_z',
    export_empty_as: 'base',
    plural_format: 'symfony',
    placeholder_format: 'icu',
    indentation: '2sp',
    original_filenames: false,
    filter_data: ['all'],
  },
}

/**
 * @param config {Config}
 * @returns {ProcessConfig}
 */
export const setupProcessConfig = (config) => {
  const { projectId: project_id, branch, outputDir, processesOptions: customPocessesOptions } = config;

  const processOptions = customPocessesOptions?.[config.process] ?? defaultOptions[config.process];
  if(config.process === 'keys') {
    processOptions.project_id = project_id;
    processOptions.include_translations = 1;
  }

  return {
    project_id,
    branch,
    outputDir,
    options: processOptions,
  };
}

export const getConfigFromFile = async () => {
  const filePath = path.resolve('./.lokalise.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('Config file not found');
  }

  const configStr = await fsp.readFile(filePath, 'utf-8');
  const config = JSON.parse(configStr);

  return config;
}
