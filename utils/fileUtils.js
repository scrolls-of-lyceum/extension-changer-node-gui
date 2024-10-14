//utils/fileUtils.js
import fs from "fs";
import path from "path";

export function listFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

export function changeFileExtensions(
  directoryPath,
  sourceExtension,
  targetExtension
) {
  const files = listFilesRecursively(directoryPath);
  let affectedFileCount = 0;

  files.forEach((file) => {
    if (file.endsWith(sourceExtension)) {
      const newFile = file.replace(sourceExtension, targetExtension);
      fs.renameSync(file, newFile);
      affectedFileCount++;
    }
  });
  return affectedFileCount;
}
export function getFileCount(directoryPath, sourceExtension) {
  const files = listFilesRecursively(directoryPath);
  let affectedFileCount = 0;

  files.forEach((file) => {
    if (file.endsWith(sourceExtension)) {
      affectedFileCount++;
    }
  });
  return affectedFileCount;
}
