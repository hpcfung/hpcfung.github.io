
function getCompiledText(raw_text) {
  // remove first and last empty line
  processed_text = raw_text.replace(/^\s*\n/, '')
  processed_text = processed_text.replace(/\n\s*$/, '')
  // multiline break: gap should be 1
  processed_text = processed_text.replaceAll(/\n\s*\n\s*\n/g, '\n\n')
  
  // Q:, X detect whitespace after Q number; removes all preceding whitespace, \s without \n
  // [\f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
  // disjunction |: matches left condition first?
  processed_text = processed_text.replaceAll(/^\s*[0-9]+(.\)|[.) ])/mg, '_Q:')
  
  // A:
  processed_text = processed_text.replaceAll(/^\s*[A-Fa-f](.\)|[.)])?[ ]/mg, '_A:')
  processed_text = processed_text.replaceAll(/_A:[\f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '_A: ')

  // P: disjunction order matters
  processed_text = processed_text.replaceAll(/^\s*(iii|ii|iv|v|viii|vii|vi|ix|x|i)(.\)|[.)])?[ ]/mgi, '_P:')
  processed_text = processed_text.replaceAll(/_P:[\f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '_P: ')

  // make sure there is exactly one newline before and one whitespace after Q number
  processed_text = processed_text.replaceAll(/_Q:[\f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '\n_Q: ')
  return processed_text
}

function repr(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
      var char = str.charAt(i);
      switch (char) {
        case '\n':
          result += '\\n';
          break;
        case '\r':
          result += '\\r';
          break;
        case '\t':
          result += '\\t';
          break;
        case ' ':
          result += '\\s';
          break;
        // Add more cases for other special characters as needed
        default:
          result += char;
      }
    }
    return result;
  }

function lowerOpacity(buttonElement,i,original_text) {
  // console.log(i)
  buttonElement.style.opacity = 1-i/200;
  if (i < 100) {
      const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,i+1,original_text), 10);
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
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,1,"Add raw text"), 10);
  document.getElementById("rawText").value = ""
}

function generateDocx() {
  // https://docx.js.org/#/usage/styling-with-xml
  // host: https://www.unpkg.com/ (all npm)
  // alt: https://docxtemplater.com/ (some features paid)
  // https://cdnjs.com/ (not all)

  // somehow loads all files and dependencies automatically
  
  // Refresh button and rawText textarea
  buttonElement = document.getElementById("gen_button")
  buttonElement.textContent = "Generated!";
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,1,"Generate"), 10);
}

function generate() {
  // const doc = new docx.Document({
  //   sections: [
  //     {
  //       properties: {},
  //       children: [
  //         new docx.Paragraph({
  //           children: [
  //             new docx.TextRun("Hello World"),
  //             new docx.TextRun({
  //               text: "Foo Bar",
  //               bold: true
  //             }),
  //             new docx.TextRun({
  //               text: "\tGithub is the best",
  //               bold: true
  //             })
  //           ]
  //         })
  //       ]
  //     }
  //   ]
  // });

  // const doc = new docx.Document({
  //   sections: [{
  //     children: [
  //         new docx.Paragraph({
  //             text: "Bullet points",
  //             bullet: {
  //                 level: 0 // How deep you want the bullet to be. Maximum level is 9
  //             }
  //         }),
  //         new docx.Paragraph({
  //             text: "Are awesome",
  //             bullet: {
  //                 level: 0
  //             }
  //         })
  //     ],
  //   }]
  // });

  const doc = new docx.Document({
    numbering: {
      config: [
          {
              reference: "numbered-list",
              levels: [
                  {
                      level: 0,
                      format: docx.LevelFormat.DECIMAL,
                      text: "%1.",
                      alignment: docx.AlignmentType.LEFT,
                      style: {
                        paragraph: {
                            indent: { left: 363, hanging: 363 },
                        },
                    },
                  },
              ],
          },
      ],
    },
    sections: [{
      children: [
          new docx.Paragraph({
              text: "Bullet points",
              numbering: {
                reference: "numbered-list",
                level: 0,
            },
          }),
          new docx.Paragraph({
              text: "Are awesome",
              numbering: {
                reference: "numbered-list",
                level: 0,
            },
          })
      ],
    }]
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "num_points.docx");
    console.log("Document created successfully");
  });
}
