const { QTreeWidgetItem } = require("@nodegui/nodegui");
const fs = require("fs");

/**
 * Populates a QTreeWidget with files and directories.
 * @param {QTreeWidgetItem} treeItem - The tree item to populate
 * @param {string} dirPath - The directory path
 */
function populateTreeWithFiles(treeItem, dirPath) {
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

module.exports = { populateTreeWithFiles };
