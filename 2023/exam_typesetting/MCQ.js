
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
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,1,"Generate"), 10);
}

/**
   * instruct_text expected format:
   * [
   *  '_Q: This is a question',
   *  '_A: This is an answer',
   *  '_Q: This is another question'
   * ]
   */
function getSectionsChildren(text_arr) {
  let children = [];
  for (text_str of text_arr) {
    let text_extract = text_str.slice(4); // '_Q: ' removed
    switch (text_str[1]) {
      case 'Q':
        children.push(new docx.Paragraph({
          text: "",
          spacing: { before: docx.convertMillimetersToTwip(4)},
          numbering: {
            reference: "numbered-parts-list",
            level: 0,
          },
        }),
        new docx.Paragraph({
          text: text_extract,
          spacing: { before: docx.convertMillimetersToTwip(6)},
          numbering: {
            reference: "numbered-list",
            level: 0,
          },
        }));
        break;
      case 'A':
        children.push(new docx.Paragraph({
          text: text_extract,
          spacing: { before: docx.convertMillimetersToTwip(6)},
          numbering: {
            reference: "numbered-list",
            level: 1,
          },
        }));
        break;
      case 'P':
        children.push(new docx.Paragraph({
          text: text_extract,
          spacing: { before: docx.convertMillimetersToTwip(2)},
          numbering: {
            reference: "numbered-parts-list",
            level: 1,
          },
        }));
        break;
      default:
        console.log('Error: none of Q, A, P')
    }
  }
  return children
}

function generateDocx(sectionsChildren) {

  // const sample_text = [
  //   ["Q","If the optic nerve is cut at the optic chiasm, what kind of deficit to vision will occur?"],
  //   ["A","Monocular blindness"],
  //   ["A","Contralateral homonymous hemianopia"],
  //   ["A","Bitemporal heteronymous hemianopia"],
  //   ["A","Homonymous inferior quadrantanopia"],
  //   ["Q","Which of the following related to Glasgow Coma Scale is/are correct?"],
  //   ["P","Clinical index for assessing the neurological deficits"],
  //   ["P","Effective way for early detection of increased intracranial pressure"],
  //   ["P","Scores range from 0 to 15"],
  //   ["P","Focus on eye activity, verbal & the worse motor response"],
  //   ["P","Stimulus to extremities by pressing the nail plate is one of the standard technique to apply central stimulus"],
  //   ["A","ii only"],
  //   ["A","i, ii, & iii"],
  //   ["A","ii, iv, & v"],
  //   ["A","i, ii, iv & v"],
  //   ["Q","What kind of pupil examination should be involved?"],
  //   ["P","Responses to light (direct)"],
  //   ["P","Pupil size"],
  //   ["P","Accommodation reflux"],
  //   ["P","Pupillary light reflex"],
  //   ["P","Pupil symmetry and reaction"],
  //   ["A","ii only"],
  //   ["A","i, ii, iii & v"],
  //   ["A","ii, iv, & v"],
  //   ["A","All the above are correct"]
  // ]

  const doc = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            size: "11.5pt"
          }
        }
      }
    },
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
                    indent: { left: docx.convertMillimetersToTwip(6.4), hanging: docx.convertMillimetersToTwip(6.4) },
                },
                // run: {
                //   size: "10pt"
                // },
              },
            },
            {
              level: 1,
              format: docx.LevelFormat.UPPER_LETTER,
              text: "%2.",
              alignment: docx.AlignmentType.LEFT,
              style: {
                paragraph: {
                    indent: { left: docx.convertMillimetersToTwip(15), hanging: docx.convertMillimetersToTwip(7.5) },
                },
              },
            },
          ],
        },
        {
          reference: "numbered-parts-list",
          levels: [
            {
              level: 0,
              alignment: docx.AlignmentType.RIGHT,
              style: {
                paragraph: {
                    indent: { left: docx.convertMillimetersToTwip(6.4), hanging: docx.convertMillimetersToTwip(6.4) },
                },
              },
            },
            {
              level: 1,
              format: docx.LevelFormat.LOWER_ROMAN,
              text: "%2.",
              alignment: docx.AlignmentType.RIGHT,
              style: {
                paragraph: {
                    indent: { left: docx.convertMillimetersToTwip(15), hanging: docx.convertMillimetersToTwip(5) },
                },
              },
            },
          ],
        }
      ],
    },
    sections: [{
      children: sectionsChildren,
    }]
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "MCQs-Exam-Paper-STUDENT.docx");
    console.log("Document created successfully");
  });
}
