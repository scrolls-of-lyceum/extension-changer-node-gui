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
import { idGen, idGenerator } from "./utils/funcs.js";

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

const selectDirButton = new QPushButton();
selectDirButton.setText("Select Directory");
layout.addWidget(selectDirButton);

const pathInput = new QLineEdit();
layout.addWidget(pathInput);

// Create a QTreeWidget to display the file tree
const fileTreeWidget = new QTreeWidget();
fileTreeWidget.setHeaderLabels(["File/Folder"]);
layout.addWidget(fileTreeWidget);

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

// Button for adding new extension pairs
const addPairButton = new QPushButton();
addPairButton.setText("+");
layout.addWidget(addPairButton);

const changeExtensionsButton = new QPushButton();
changeExtensionsButton.setText("Change Extensions");
layout.addWidget(changeExtensionsButton);

// Label to show the count of affected files
const jsFileCountLabel = new QLabel();
jsFileCountLabel.setText("Files to be affected: 0");
layout.addWidget(jsFileCountLabel);

// Container for dynamic extension inputs
const dynamicExtensionContainer = new QWidget();
const dynamicLayout = new FlexLayout();
dynamicExtensionContainer.setLayout(dynamicLayout);
layout.addWidget(dynamicExtensionContainer);

//! TODO update this based on new requirement
// Store new extension pairs
const extensionPairs = []; //{id:[source , target]

// Set the central widget
win.setCentralWidget(centralWidget);

// Function to update the affected file count
function updateAffectedFileCount(directoryPath) {
  console.log("extensionPairs", extensionPairs);

  const allSourceExtensions = [
    sourceExtensionInput.text(),
    ...extensionPairs.map((pair) => pair.source),
  ];
  const affectedFileCount = allSourceExtensions.reduce((count, ext) => {
    return (
      count +
      listFilesRecursively(directoryPath).filter((file) => file.endsWith(ext))
        .length
    );
  }, 0);

  updateAffectLabel(`Files to be affected: ${affectedFileCount}`);
}

function updateAffectLabel(text) {
  jsFileCountLabel.setText(`${text}`);
}

// Event: Select directory and list files recursively
selectDirButton.addEventListener("clicked", () => {
  const fileDialog = new QFileDialog();
  fileDialog.setFileMode(2); // Use 2 for Directory mode directly
  fileDialog.directoryPath = "./abc";
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

  let affectedFileCounts = changeFileExtensions(
    directoryPath,
    sourceExtensionInput.text(),
    targetExtensionInput.text()
  );

  // Change additional pairs
  extensionPairs.forEach((pair) => {
    affectedFileCounts += changeFileExtensions(
      directoryPath,
      pair.source,
      pair.target
    );
  });

  // Refresh tree view after renaming
  fileTreeWidget.clear();
  const rootItem = new QTreeWidgetItem([directoryPath]);
  fileTreeWidget.addTopLevelItem(rootItem);
  populateTreeWithFiles(rootItem, directoryPath);

  // Update the label after renaming
  jsFileCountLabel.setText(`Files affected: ${affectedFileCounts}`);
});

// Update affected file count when extensions change
sourceExtensionInput.addEventListener("textChanged", () => {
  const directoryPath = pathInput.text();
  if (directoryPath) {
    updateAffectedFileCount(directoryPath);
  }
});

// Event: Add new pair of extensions
addPairButton.addEventListener("clicked", () => {
  const newSourceInput = new QLineEdit();
  const newTargetInput = new QLineEdit();
  const newSourceLabel = new QLabel();
  const newTargetLabel = new QLabel();

  newSourceLabel.setText("New Source Extension:");
  newSourceInput.setPlaceholderText(".tft");
  newSourceInput.setObjectName(idGen.next().value);

  newTargetLabel.setText("New Target Extension:");
  newTargetInput.setPlaceholderText(".txt");
  newTargetInput.setObjectName(idGen.next().value);

  dynamicLayout.addWidget(newSourceLabel);
  dynamicLayout.addWidget(newSourceInput);
  dynamicLayout.addWidget(newTargetLabel);
  dynamicLayout.addWidget(newTargetInput);

  // Store the new pair when the inputs change
  newSourceInput.addEventListener("textChanged", () => {
    console.log("newSourceInput", newSourceInput.objectName());
    const id = newSourceInput.objectName();
    extensionPairs.push({
      [id]: {
        source: newSourceInput.text(),
        target: newTargetInput.text(),
      },
    });
    updateAffectedFileCount(pathInput.text());
  });

  newTargetInput.addEventListener("textChanged", () => {
    const id = newTargetInput.objectName();
    extensionPairs.push({
      [id]: {
        source: newSourceInput.text(),
        target: newTargetInput.text(),
      },
    });
    updateAffectedFileCount(pathInput.text());
  });
});

// Show the window
win.show();
global.win = win; // Prevent garbage collection
