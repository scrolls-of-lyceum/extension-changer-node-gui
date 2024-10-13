import fs from "fs";
import path from "path";
import { QTreeWidgetItem } from "@nodegui/nodegui";

export function populateTreeWithFiles(treeItem, dirPath) {
  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    const childItem = new QTreeWidgetItem([item]);

    if (stat.isDirectory()) {
      treeItem.addChild(childItem);
      populateTreeWithFiles(childItem, fullPath); // Populate subdirectories
    } else {
      treeItem.addChild(childItem);
    }
  });
}
