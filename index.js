import {
  QMainWindow,
  QWidget,
  QLabel,
  QLineEdit,
  QPushButton,
  FlexLayout,
  QFileDialog,
  QTreeWidget,
  QTreeWidgetItem,
} from "@nodegui/nodegui";

import { populateTreeWithFiles } from "./utils/uiUtils.js";
import {
  listFilesRecursively,
  changeFileExtensions,
} from "./utils/fileUtils.js";

// Create a window
const win = new QMainWindow();
win.setWindowTitle("File Extension Changer");

// Set window size (make it bigger)
win.resize(800, 600);

// Create the central widget and layout
const centralWidget = new QWidget();
const layout = new FlexLayout();
centralWidget.setLayout(layout);

// Add input fields and buttons
const inputLabel = new QLabel();
inputLabel.setText("Selected Directory:");
layout.addWidget(inputLabel);

const pathInput = new QLineEdit();
layout.addWidget(pathInput);

// Create a QTreeWidget to display the file tree
const fileTreeWidget = new QTreeWidget();
fileTreeWidget.setHeaderLabels(["File/Folder"]);
layout.addWidget(fileTreeWidget);

// Label to show the count of affected files
const jsFileCountLabel = new QLabel();
jsFileCountLabel.setText("Files to be affected: 0");
layout.addWidget(jsFileCountLabel);

// Input for source extension
const sourceExtensionLabel = new QLabel();
sourceExtensionLabel.setText("Source Extension (e.g., .js):");
layout.addWidget(sourceExtensionLabel);

const sourceExtensionInput = new QLineEdit();
sourceExtensionInput.setText(".js"); // Default value
layout.addWidget(sourceExtensionInput);

// Input for target extension
const targetExtensionLabel = new QLabel();
targetExtensionLabel.setText("Target Extension (e.g., .ts):");
layout.addWidget(targetExtensionLabel);

const targetExtensionInput = new QLineEdit();
targetExtensionInput.setText(".ts"); // Default value
layout.addWidget(targetExtensionInput);

const selectDirButton = new QPushButton();
selectDirButton.setText("Select Directory");
layout.addWidget(selectDirButton);

const changeExtensionsButton = new QPushButton();
changeExtensionsButton.setText("Change Extensions");
layout.addWidget(changeExtensionsButton);

// Set the central widget
win.setCentralWidget(centralWidget);

// Function to update the affected file count
function updateAffectedFileCount(directoryPath) {
  const sourceExtension = sourceExtensionInput.text();
  const affectedFileCount = listFilesRecursively(directoryPath).filter((file) =>
    file.endsWith(sourceExtension)
  ).length;

  jsFileCountLabel.setText(`Files to be affected: ${affectedFileCount}`);
}

// Event: Select directory and list files recursively
selectDirButton.addEventListener("clicked", () => {
  const fileDialog = new QFileDialog();
  fileDialog.setFileMode(2); // Use 2 for Directory mode directly

  fileDialog.exec();
  const selectedFiles = fileDialog.selectedFiles();

  if (selectedFiles.length > 0) {
    const directoryPath = selectedFiles[0];
    pathInput.setText(directoryPath);

    // Clear previous tree
    fileTreeWidget.clear();

    // List all files and directories in the tree
    const rootItem = new QTreeWidgetItem([directoryPath]);
    fileTreeWidget.addTopLevelItem(rootItem);

    // Populate the tree and update the affected file count
    populateTreeWithFiles(rootItem, directoryPath);
    updateAffectedFileCount(directoryPath);
  }
});

// Event: Change file extensions
changeExtensionsButton.addEventListener("clicked", () => {
  const directoryPath = pathInput.text();
  const sourceExtension = sourceExtensionInput.text();
  const targetExtension = targetExtensionInput.text();

  if (directoryPath) {
    const affectedFileCount = changeFileExtensions(
      directoryPath,
      sourceExtension,
      targetExtension
    );

    // Refresh tree view after renaming
    fileTreeWidget.clear();
    const rootItem = new QTreeWidgetItem([directoryPath]);
    fileTreeWidget.addTopLevelItem(rootItem);
    populateTreeWithFiles(rootItem, directoryPath);

    // Update the label after renaming
    jsFileCountLabel.setText(`Files affected: ${affectedFileCount}`);
  }
});

// Update affected file count when extensions change
sourceExtensionInput.addEventListener("textChanged", () => {
  const directoryPath = pathInput.text();
  if (directoryPath) {
    updateAffectedFileCount(directoryPath);
  }
});

targetExtensionInput.addEventListener("textChanged", () => {
  const directoryPath = pathInput.text();
  if (directoryPath) {
    updateAffectedFileCount(directoryPath);
  }
});

// Show the window
win.show();
global.win = win; // Prevent garbage collection

// // Utility functions
// function listFilesRecursively(dir) {
//   let results = [];
//   const list = fs.readdirSync(dir);
//   list.forEach((file) => {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);
//     if (stat && stat.isDirectory()) {
//       results = results.concat(listFilesRecursively(filePath));
//     } else {
//       results.push(filePath);
//     }
//   });
//   return results;
// }

// function changeFileExtensions(directoryPath, sourceExtension, targetExtension) {
//   const files = listFilesRecursively(directoryPath);
//   let affectedFileCount = 0;

//   files.forEach((file) => {
//     if (file.endsWith(sourceExtension)) {
//       const newFile = file.replace(sourceExtension, targetExtension);
//       fs.renameSync(file, newFile);
//       affectedFileCount++;
//     }
//   });
//   return affectedFileCount;
// }

// function populateTreeWithFiles(treeItem, dirPath) {
//   const items = fs.readdirSync(dirPath);
//   items.forEach((item) => {
//     const fullPath = path.join(dirPath, item);
//     const stat = fs.statSync(fullPath);
//     const childItem = new QTreeWidgetItem([item]);

//     if (stat.isDirectory()) {
//       treeItem.addChild(childItem);
//       populateTreeWithFiles(childItem, fullPath); // Populate subdirectories
//     } else {
//       treeItem.addChild(childItem);
//     }
//   });
// }
