
const test_str = '_Q: This is a question\n_A: This is an answer\n_Q: This is another question';
const array = [...test_str.matchAll(/(?<=_Q: ).*$/gm)];
const array = [...test_str.matchAll(/_[APQ].*$/gm)];
console.log(array);
