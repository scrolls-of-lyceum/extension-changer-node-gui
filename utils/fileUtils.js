import fs from "fs";
import path from "path";

/**
 * Recursively lists all files in a directory.
 * @param {string} dir - Directory path
 * @returns {Array<string>} - List of file paths
 */
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

/**
 * Renames files with the specified source extension to the target extension.
 * @param {string} directoryPath - The directory containing files
 * @param {string} sourceExtension - The source file extension
 * @param {string} targetExtension - The target file extension
 * @returns {number} - The count of affected files
 */
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
