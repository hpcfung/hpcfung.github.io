function test1() {  
  const test_str = '_Q: This is a question\n_A: This is an answer\n_Q: This is another question';
  const array = [...test_str.matchAll(/(?<=_Q: ).*$/gm)];
  const array = [...test_str.matchAll(/_[APQ].*$/gm)];
  console.log(array);
}

function test2() {
  const test_str = '_Q: This is a question\n_A: This is an answer\n_Q: This is another question';

const array = [...test_str.matchAll(/_[APQ].*$/gm)];
extracted_text = array.map(arr => arr[0]);
console.log(extracted_text);

for (text_str of extracted_text) {
    console.log('');
    console.log(text_str);
    console.log(text_str[1]);
    console.log(text_str.slice(4));
}
}
