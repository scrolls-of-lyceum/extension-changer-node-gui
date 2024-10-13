const {
  QMainWindow,
  QWidget,
  QLabel,
  QLineEdit,
  QPushButton,
  FlexLayout,
  QFileDialog,
  QListWidget,
  QListWidgetItem,
} = require("@nodegui/nodegui");
const fs = require("fs");
const path = require("path");

// Create a window
const win = new QMainWindow();
win.setWindowTitle("File Extension Changer");

// Create the central widget and layout
const centralWidget = new QWidget();
const layout = new FlexLayout();
centralWidget.setLayout(layout); // Set layout once

// Add input fields and buttons
const inputLabel = new QLabel();
inputLabel.setText("Selected Directory:");
layout.addWidget(inputLabel); // Correctly add widget to layout

const pathInput = new QLineEdit();
layout.addWidget(pathInput);

const fileListWidget = new QListWidget();
layout.addWidget(fileListWidget);

const selectDirButton = new QPushButton();
selectDirButton.setText("Select Directory");
layout.addWidget(selectDirButton); // Ensure button is added to layout

const changeExtensionsButton = new QPushButton();
changeExtensionsButton.setText("Change .js to .ts");
layout.addWidget(changeExtensionsButton); // Ensure button is added to layout

// Set the central widget
win.setCentralWidget(centralWidget); // This should happen after all widgets are added

// Event: Select directory and list files recursively
selectDirButton.addEventListener("clicked", () => {
  const fileDialog = new QFileDialog();
  fileDialog.setFileMode(2); // 2 = Directory selection mode

  fileDialog.exec();
  const selectedFiles = fileDialog.selectedFiles();

  if (selectedFiles.length > 0) {
    const directoryPath = selectedFiles[0];
    pathInput.setText(directoryPath);

    // Clear previous list
    fileListWidget.clear();

    // List all files
    const files = listFilesRecursively(directoryPath);
    files.forEach((file) => {
      const fileItem = new QListWidgetItem(file);
      fileListWidget.addItem(fileItem);
    });
  }
});

// Event: Change .js extensions to .ts
changeExtensionsButton.addEventListener("clicked", () => {
  const directoryPath = pathInput.text();
  if (directoryPath) {
    const files = listFilesRecursively(directoryPath);
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        const newFile = file.replace(".js", ".ts");

        fs.renameSync(file, newFile);
      }
      if (file.endsWith(".jsx")) {
        const newFile = file.replace(".jsx", ".tsx");

        fs.renameSync(file, newFile);
      }
    });

    // Refresh file list after renaming
    fileListWidget.clear();
    const updatedFiles = listFilesRecursively(directoryPath);
    updatedFiles.forEach((file) => {
      const fileItem = new QListWidgetItem(file);
      fileListWidget.addItem(fileItem);
    });
  }
});

// Function to list all files recursively
function listFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Recursively list files in subdirectories
      results = results.concat(listFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Show the window
win.show();

global.win = win; // Prevent garbage collection
