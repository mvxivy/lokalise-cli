import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { finished } from 'node:stream/promises';
import { Readable } from 'node:stream';
import childProcess from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(childProcess.exec);

const downloadFile = async (fileUrl, tempDirPath) => {
  const response = await fetch(fileUrl);

  if (!fs.existsSync(tempDirPath)) {
    await fsp.mkdir(tempDirPath);
  }

  // file name from file url
  const fileName = fileUrl.split('/').pop();
  const destination = path.resolve(tempDirPath, fileName);
  const fileStream = fs.createWriteStream(destination);
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
  return destination;
};

const unzipFiles = async (zipFilePath, tempDirPath) => {
  try {
    if (process.platform === 'win32') {
      await exec(`powershell -Command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${tempDirPath}' -Force"`);
    } else {
      await exec(`unzip -o ${zipFilePath} -d ${tempDirPath}`);
    }
  } catch (error) {
    throw new Error(`unzip error: ${error}`);
  }

  // Clean up the zip file
  fs.rmSync(zipFilePath);

  // Return the list of files
  const files = await fsp.readdir(tempDirPath).catch((err) => {
    throw new Error(`readdir error: ${err}`);
  });

  return files;
};

const deployFiles = async (files, distPath, tempDirPath) => {
  const dist = path.resolve(distPath);
  const writes = [];
  for (const file of files) {
    const promise = fsp.rename(path.resolve(tempDirPath, file), path.resolve(dist, file));
    writes.push(promise);
  }

  await Promise.all(writes);
};

const cleanupTempDir = (tempDirPath) => {
  fs.rmSync(tempDirPath, { recursive: true });
};

/**
 *
 * @param lokalise {LokaliseApi}
 * @param config {ProcessConfig}
 * @returns {Promise<void>}
 */
export const processFiles = async (lokalise, config) => {
  const { bundle_url } = await lokalise
    .files()
    .download(config.project_id, config.options);

  const tempDirPath = path.resolve(config.outputDir, 'tmp');

  const zipFilePath = await downloadFile(bundle_url, tempDirPath);
  const files = await unzipFiles(zipFilePath, tempDirPath);
  await deployFiles(files, config.outputDir, tempDirPath);

  cleanupTempDir(tempDirPath);
};
