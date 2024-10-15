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
win.resize(800, 750);

// Create the central widget and layout
const centralWidget = new QWidget();
const layout = new FlexLayout();

centralWidget.setLayout(layout);

const selectDirButton = new QPushButton();
selectDirButton.setText("Select Directory");
selectDirButton.setInlineStyle(
  "width:350px; padding:6px 3px; color:blue ;margin-left:auto;margin-right:auto; "
);
layout.addWidget(selectDirButton);

// Add input fields and buttons
const inputLabel = new QLabel();
inputLabel.setText("Selected Directory:");
inputLabel.setInlineStyle(
  "margin: 10px;color:green; margin-bottom:0; background:transparent"
);
layout.addWidget(inputLabel);

//Path input
const pathInput = new QLineEdit();
pathInput.setInlineStyle(
  "margin: 2px 8px; margin-bottom:6px;padding:3px; background:transparent;border:1px solid #999;border-radius:6px;"
);
layout.addWidget(pathInput);

// Create a QTreeWidget to display the file tree
const fileTreeWidget = new QTreeWidget();
fileTreeWidget.setHeaderLabels(["File/Folder"]);
fileTreeWidget.setInlineStyle("margin:0px 8px ;");
layout.addWidget(fileTreeWidget);
/* 
// Input for source extension
const sourceExtensionLabel = new QLabel();
sourceExtensionLabel.setText("Source Extension (e.g., .js):");
sourceExtensionLabel.setInlineStyle("margin:0px 8px ; width:180px");
layout.addWidget(sourceExtensionLabel);

const sourceExtensionInput = new QLineEdit();
sourceExtensionInput.setText(".js"); // Default value
sourceExtensionInput.setInlineStyle("margin:0px 8px ;  width:180px");
layout.addWidget(sourceExtensionInput);

// Input for target extension
const targetExtensionLabel = new QLabel();
targetExtensionLabel.setText("Target Extension (e.g., .ts):");
targetExtensionLabel.setInlineStyle("margin:0px 8px ; width:180px");
layout.addWidget(targetExtensionLabel);

const targetExtensionInput = new QLineEdit();
targetExtensionInput.setText(".ts"); // Default value
targetExtensionInput.setInlineStyle("margin:0px 8px ; width:180px");
layout.addWidget(targetExtensionInput);
 */

// Create a parent container for source and target extensions
const extensionContainer = new QWidget();
const extensionLayout = new FlexLayout();
extensionContainer.setLayout(extensionLayout);

// Set the flex direction to row to display source and target side by side
extensionContainer.setInlineStyle("flex-direction: row;");

// Create a container for the source extension (label + input)
const sourceContainer = new QWidget();
const sourceLayout = new FlexLayout();
sourceContainer.setLayout(sourceLayout);

// Input for source extension
const sourceExtensionLabel = new QLabel();
sourceExtensionLabel.setText("Source Extension (e.g., .js):");
sourceExtensionLabel.setInlineStyle("margin:0px 8px; width:180px;");
const sourceExtensionInput = new QLineEdit();
sourceExtensionInput.setText(".js"); // Default value
sourceExtensionInput.setInlineStyle("margin:0px 8px; width:180px;");

// Add the label and input to the source layout
sourceLayout.addWidget(sourceExtensionLabel);
sourceLayout.addWidget(sourceExtensionInput);

// Create a container for the target extension (label + input)
const targetContainer = new QWidget();
const targetLayout = new FlexLayout();
targetContainer.setLayout(targetLayout);

// Input for target extension
const targetExtensionLabel = new QLabel();
targetExtensionLabel.setText("Target Extension (e.g., .ts):");
targetExtensionLabel.setInlineStyle("margin:0px 8px; width:180px;");
const targetExtensionInput = new QLineEdit();
targetExtensionInput.setText(".ts"); // Default value
targetExtensionInput.setInlineStyle("margin:0px 8px; width:180px;");

// Add the label and input to the target layout
targetLayout.addWidget(targetExtensionLabel);
targetLayout.addWidget(targetExtensionInput);

// Add both source and target containers to the parent extensionContainer
extensionLayout.addWidget(sourceContainer);
extensionLayout.addWidget(targetContainer);

// Finally, add the extensionContainer to the main layout
layout.addWidget(extensionContainer);

// Button for adding new extension pairs
const addPairButton = new QPushButton();
addPairButton.setText("+");
addPairButton.setInlineStyle("width:120px;margin:3px auto");
layout.addWidget(addPairButton);

// Container for dynamic extension inputs
const dynamicExtensionContainer = new QWidget();
const dynamicLayout = new FlexLayout();
dynamicExtensionContainer.setInlineStyle("padding:8px ;display:flex");
dynamicExtensionContainer.setLayout(dynamicLayout);

dynamicExtensionContainer.setInlineStyle(
  "height:150px; overflow:scroll;background:#fff;margin:0 6px;"
);
layout.addWidget(dynamicExtensionContainer);

const changeExtensionsButton = new QPushButton();
changeExtensionsButton.setText("Change Extensions");
changeExtensionsButton.setInlineStyle(
  "color:green; font-weight:bold ; width:250px ; margin :2px auto; background:#4f4 ; padding:6px ; "
);
layout.addWidget(changeExtensionsButton);

// Label to show the count of affected files
const jsFileCountLabel = new QLabel();
jsFileCountLabel.setText("Files to be affected: 0");
jsFileCountLabel.setInlineStyle(
  "margin: 0 12px; color:#333; font-weight:bold;"
);
layout.addWidget(jsFileCountLabel);
// Store new extension pairs
const extensionPairs = [];

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
    console.log("single pair", pair);

    affectedFileCounts += changeFileExtensions(directoryPath, pair[0], pair[1]);
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
// addPairButton.addEventListener("clicked", () => {
//   const newSourceInput = new QLineEdit();
//   const newTargetInput = new QLineEdit();
//   const newSourceLabel = new QLabel();
//   const newTargetLabel = new QLabel();

//   const idx = extensionPairs.length;
//   newSourceLabel.setText("New Source Extension:");
//   newSourceLabel.setInlineStyle("margin:0px 8px; width:180px");
//   newSourceInput.setPlaceholderText(".tft");
//   newSourceInput.setObjectName("" + idx);
//   newSourceInput.setInlineStyle("margin:0px 8px; width:180px");

//   newTargetLabel.setText("New Target Extension:");
//   newTargetLabel.setInlineStyle("margin:0px 8px; width:180px");
//   newTargetInput.setPlaceholderText(".txt");
//   newTargetInput.setInlineStyle("margin:0px 8px; width:180px;");
//   newTargetInput.setObjectName("" + idx);

//   dynamicLayout.addWidget(newSourceLabel);
//   dynamicLayout.addWidget(newSourceInput);
//   dynamicLayout.addWidget(newTargetLabel);
//   dynamicLayout.addWidget(newTargetInput);

//   // Store the new pair when the inputs change
//   newSourceInput.addEventListener("textChanged", () => {
//     console.log("newSourceInput", newSourceInput.objectName());
//     const idx = +newSourceInput.objectName();

//     extensionPairs[idx] = [newSourceInput.text(), newTargetInput.text()];

//     updateAffectedFileCount(pathInput.text());
//   });

//   newTargetInput.addEventListener("textChanged", () => {
//     const idx = +newTargetInput.objectName();

//     extensionPairs[idx] = [newSourceInput.text(), newTargetInput.text()];

//     updateAffectedFileCount(pathInput.text());
//   });
// });

addPairButton.addEventListener("clicked", () => {
  // Create a new QWidget to hold the pair of label and input
  const pairContainer = new QWidget();
  const pairLayout = new FlexLayout();

  // Set the layout to the pair container
  pairContainer.setLayout(pairLayout);
  pairContainer.setInlineStyle("display:flex ; flex-direction:row");

  // Create new source and target label and input
  const newSourceInput = new QLineEdit();
  const newTargetInput = new QLineEdit();
  const newSourceLabel = new QLabel();
  const newTargetLabel = new QLabel();

  const idx = extensionPairs.length;
  newSourceLabel.setText("New Source Extension:");
  newSourceInput.setPlaceholderText(".tft");
  newSourceInput.setObjectName("" + idx);

  newTargetLabel.setText("New Target Extension:");
  newTargetInput.setPlaceholderText(".txt");
  newTargetInput.setObjectName("" + idx);

  // Add styling using inline styles
  newSourceLabel.setInlineStyle("margin:0px; width:150px;");
  newSourceInput.setInlineStyle("margin:0px; width:150px;");
  newTargetLabel.setInlineStyle("margin:0px; width:150px;");
  newTargetInput.setInlineStyle("margin:0px; width:150px;");

  // Add the label and input directly to the pair layout
  pairLayout.addWidget(newSourceLabel);
  pairLayout.addWidget(newSourceInput);
  pairLayout.addWidget(newTargetLabel);
  pairLayout.addWidget(newTargetInput);

  // Add the pair container to the dynamic layout
  dynamicLayout.addWidget(pairContainer);

  // Store the new pair when the inputs change
  newSourceInput.addEventListener("textChanged", () => {
    const idx = +newSourceInput.objectName();
    extensionPairs[idx] = [newSourceInput.text(), newTargetInput.text()];
    updateAffectedFileCount(pathInput.text());
  });

  newTargetInput.addEventListener("textChanged", () => {
    const idx = +newTargetInput.objectName();
    extensionPairs[idx] = [newSourceInput.text(), newTargetInput.text()];
    updateAffectedFileCount(pathInput.text());
  });
});

// Show the window
win.show();
global.win = win; // Prevent garbage collection
