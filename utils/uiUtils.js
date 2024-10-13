import { QTreeWidgetItem } from "@nodegui/nodegui";
import fs from "fs";
import path from "path";

/**
 * Populates a QTreeWidget with files and directories.
 * @param {QTreeWidgetItem} treeItem - The tree item to populate
 * @param {string} dirPath - The directory path
 */
export function populateTreeWithFiles(treeItem, dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    const childItem = new QTreeWidgetItem([item]);
    treeItem.addChild(childItem);

    if (stat.isDirectory()) {
      populateTreeWithFiles(childItem, fullPath); // Populate subdirectories
    }
  });
}
