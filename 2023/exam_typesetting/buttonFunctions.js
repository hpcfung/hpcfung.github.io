/*
Architecture
buttonFunctions.js: button level, top level wrapper
preprocessing.js: raw text to compiled text
genDocx.js: compiled text to Docx
*/

function lowerOpacity(buttonElement, i, original_text) {
  // console.log(i)
  buttonElement.style.opacity = 1 - i / 200;
  if (i < 100) {
    const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement, i + 1, original_text), 10);
  } else {
    buttonElement.textContent = original_text;
    buttonElement.style.opacity = 1;
  }
}

function addRawText() {
  // Get the text area
  var raw_text = document.getElementById("rawText").value;
  console.log("Raw text:")
  console.log(raw_text)
  console.log(repr(raw_text))
  console.log("Processed text:")
  console.log(repr(getCompiledText(raw_text)))
  console.log(typeof raw_text)
  if (document.getElementById("compiledText").value === "") {
    document.getElementById("compiledText").value = getCompiledText(raw_text)
  } else {
    document.getElementById("compiledText").value += "\n\n" + getCompiledText(raw_text)
  }
  // actually, Qs from each iteration should be processed separately to avoid cross talk
  // use a simple function to enforce 1 space in between

  // Refresh button and rawText textarea
  buttonElement = document.getElementById("add_button")
  buttonElement.textContent = "Added!";
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement, 1, "Add raw text"), 10);
  document.getElementById("rawText").value = ""
}

function generateWordDoc() {
  // https://docx.js.org/#/usage/styling-with-xml
  // host: https://www.unpkg.com/ (all npm)
  // alt: https://docxtemplater.com/ (some features paid)
  // https://cdnjs.com/ (not all)
  // somehow loads all files and dependencies automatically

  var compiled_text = document.getElementById("compiledText").value
  const matches = [...compiled_text.matchAll(/_[APQ].*$/gm)];
  const extracted_text = matches.map(arr => arr[0]);
  generateDocx(getSectionsChildren(extracted_text));

  // Refresh button and rawText textarea
  buttonElement = document.getElementById("gen_button")
  buttonElement.textContent = "Generated!";
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement, 1, "Generate"), 10);
}

