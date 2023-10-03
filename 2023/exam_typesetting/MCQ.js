// setTimeout(function() {
//     let input_path = prompt("Enter absolute path to .jl (\"Copy as path\")", "\"C:\\Python_projects\\2023 USRA\\april_28_plot_test.jl\"");
//     REPL_code = "include("+input_path.replaceAll("\\","\\\\")+")";
//     code.textContent = REPL_code;
//     navigator.clipboard.writeText(REPL_code);
    
// }, (1));

// need preprocessing: page skip, Q gap
// also when merging different sources, need gap btw Qs

function lowerOpacity(buttonElement,i) {
    // console.log(i)
    buttonElement.style.opacity = 1-i/200;
    if (i < 100) {
        const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,i+1), 10);
    } else {
        buttonElement.textContent = "Add raw text";
        buttonElement.style.opacity = 1;
    }
}

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
  const myTimeout = setTimeout(lowerOpacity.bind(null, buttonElement,1), 10);
  document.getElementById("rawText").value = ""
}