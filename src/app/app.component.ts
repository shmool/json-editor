import { Component } from '@angular/core';

async function getNewFileHandle(extension) {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': [`.${ extension }`]
        }
      }
    ]
  };
  // @ts-ignore
  const handle = await window.showSaveFilePicker(options);
  return handle;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  jsonToEdit;
  encodedText;
  blob;
  changed;
  codesArray;
  errorMessage;

  constructor() {

  }

  loadFile(fileInput) {
    console.log(fileInput.files);
    const fr = new FileReader();
    fr.onload = (e) => {
      console.log(e.target);
      this.jsonToEdit = JSON.parse(fr.result.toString());
    };
    fr.readAsText(fileInput.files[0]);
    console.log(fr.result);
    this.encodedText = fr.result;
  }

  generateCodesArray(codes, charToSplit) {
    this.codesArray = codes.split(charToSplit);
    this.changed = false;
  }

  editJson(key, value) {
    this.changed = false;
    this.errorMessage = null;
    if (!this.codesArray || !this.codesArray.length) {
      this.errorMessage = 'Codes to change must be supplied';
      return;
    }
    if (!this.jsonToEdit) {
      this.errorMessage = 'JSON change must be supplied';
      return;
    }
    this.codesArray.forEach(code => {
      if (!key || !value) {
        this.errorMessage = 'key and value to change must be supplied';
      } else if (!this.jsonToEdit[code]) {
        this.errorMessage = 'code not found in JSON';
      } else {
        this.jsonToEdit[code][key] = value;
        this.changed = true;
      }
    });
  }

  async saveToFile() {
    const blob = new Blob([
        JSON.stringify(this.jsonToEdit, null, 2)],
      { type: 'application/json' });

    const fileHandle = await getNewFileHandle('json');
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(blob);
    // Close the file and write the contents to disk.
    await writable.close();
  }
}
