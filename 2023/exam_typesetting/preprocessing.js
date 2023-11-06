function getCompiledText(raw_text) {
    // remove first and last empty line
    let processed_text = raw_text.replace(/^\s*\n/, '')
    processed_text = processed_text.replace(/\n\s*$/, '')
    // multiline break: gap should be 1
    processed_text = processed_text.replaceAll(/\n\s*\n\s*\n/g, '\n\n')

    // Q:, X detect whitespace after Q number; removes all preceding whitespace, \s without \n
    // [\f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]
    // disjunction |: matches left condition first?
    processed_text = processed_text.replaceAll(/^\s*[0-9]+(.\)|[.) ])/mg, '_Q:')
    // no escaping required in a char class: .)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape#:~:text=they%20require%20escaping-,unless,-in%20a%20character

    // A:
    // maybe change to sth like (?![\n])\s, nested groups tho?
    // ie instead of listing al of \f\r...
    // also, so that catches more than [ \t]
    processed_text = processed_text.replaceAll(/^\s*[A-Fa-f](.\)|[.)]|[ \t])/mg, '_A:')
    processed_text = processed_text.replaceAll(/_A:[ \f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '_A: ')

    // P: disjunction order matters
    processed_text = processed_text.replaceAll(/^\s*(iii|ii|iv|v|viii|vii|vi|ix|x|i)(.\)|[.)])?[ \t]/mgi, '_P:')
    processed_text = processed_text.replaceAll(/_P:[ \f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '_P: ')

    // make sure there is exactly one newline before and one whitespace after Q number
    processed_text = processed_text.replaceAll(/_Q:[ \f\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*/g, '\n_Q: ')

    // remove non Q, A, P lines
    const matches = [...processed_text.matchAll(/_[APQ].*$/gm)];
    const extracted_text = matches.map(arr => arr[0]);

    let filtered_text = ''
    for (text_str of extracted_text) {
        if (text_str[1] === 'Q') {
            filtered_text += '\n'
        }
        filtered_text += text_str + '\n'
    }

    return filtered_text
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


