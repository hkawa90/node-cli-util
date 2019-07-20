/** Word wrap
 * @param {String} input string
 * @param {wrapLength} wrap length
 * @param {Object} option
 * @returns {String} word wrapped string.
 * @example
 * wordwrap('This is a paragraph with several words in it.', 10)
 * // 'This is a \nparagraph \nwith several\nwords in it\n.'
 * @todo Prohibition processing for Japanese https://github.com/trkbt10/mikan.js
 * @todo ([a-zA-Z\s\"\']{10,}?)\s?\b\.?\??\!?  support '".
 */
exports.wordWrap = function (str, wrapLength, option) {
    let defaultOptions = {};
    Object.assign(defaultOptions, option || defaultOptions);
    let reg = new RegExp('([\\W\\w\\s]{' + wrapLength + ',}?)\\s?\\b', 'g');
    let wstr = str.replace(reg, '$1\n');
    return wstr;
}

/** Fromat string using placeholder
 * @param formatString format string
 * @param args string to replace
 * @description 
 *   Syntax : '{' + property + '}'[%[parameter][flags][width][.precision][length]type]
 * @example
 * formatter('[{progress_bar}[%10s]] {percentage}[%3d]%', {progress_bar: '===>', percentage: 30})
 * // [===>      ] 30%
 * @returns formatted string
 */
exports.formatter = function (formatString, args) {
    let result;
    let index = 0;
    let buffer = '';
    let number, zeroPadding;
    const regPattern = /{(\w+)}(\[(%{1}(\-{0,1}\d*\.?\d*)?(l?[csfduxXeg])?)\])?/g;
    while ((result = regPattern.exec(formatString)) != null) {
        field_width = result[4]; // field width(negative value : left alignment)
        conversion_specifier = result[5]; // conversion specifier l?[csfduxeg]
        buffer += formatString.substring(index, result.index);
        formattedString = '';
        if (args[result[1]] !== undefined) {
            switch (conversion_specifier) {
                case 'c':
                    if (field_width === undefined) {
                        formattedString = args[result[1]].substring(0, 1);
                    } else {
                        if (parseInt(field_width, 10) < 0) {
                            formattedString = args[result[1]].substring(0, 1).padEnd(-field_width);
                        } else {
                            formattedString = args[result[1]].substring(0, 1).padStart(field_width);
                        }
                    }
                    break;
                case 's':
                    if (field_width === undefined) {
                        formattedString = args[result[1]];
                    } else {
                        if (parseInt(field_width, 10) < 0) {
                            formattedString = args[result[1]].toString().padEnd(-field_width);
                        } else {
                            formattedString = args[result[1]].toString().padStart(field_width);
                        }
                    }
                    break;
                case 'e': // Exponential
                case 'f': // Float
                case 'g':
                    number = parseFloat(args[result[1]]);
                    var field = field_width.split('.');
                    var precision_width, w;
                    w = parseInt(field[0], 10);
                    if (field.length > 1) {
                        precision_width = field[1] === '' ? 0 : field[1];
                    } else {
                        precision_width = 0;
                    }
                    if (conversion_specifier === 'f') {
                        if (w < 0) { // left alignment
                            formattedString = number.toFixed(precision_width).padEnd(-w);
                        } else { // right alignment
                            formattedString = number.toFixed(precision_width).padStart(w);
                        }
                    } else {
                        if (w < 0) { // left alignment
                            formattedString = number.toExponential(precision_width).padEnd(-w);
                        } else { // right alignment
                            formattedString = number.toExponential(precision_width).padStart(w);
                        }
                    }
                    break;
                case 'd':
                case 'u': // unsigned
                    number = (conversion_specifier === 'u') ? parseInt(args[result[1]], 10) >>> 0 : parseInt(args[result[1]], 10);
                    if (field_width === undefined) {
                        if (conversion_specifier === 'u')
                            formattedString = number >>> 0;
                        else
                            formattedString = number;
                    } else {
                        zeroPadding = field_width.substring(0, 1) === '0' ? true : false;
                        if (parseInt(field_width, 10) < 0) {
                            if (zeroPadding)
                                formattedString = number.toString(10).padEnd(-field_width, '0');
                            else
                                formattedString = number.toString(10).padEnd(-field_width);
                        } else {
                            if (zeroPadding)
                                formattedString = number.toString(10).padStart(field_width, '0');
                            else
                                formattedString = number.toString(10).padStart(field_width);
                        }
                    }
                    break;
                case 'x': // hex
                case 'X': // hex
                    number = args[result[1]].toString(16);
                    zeroPadding = field_width.substring(0, 1) === '0' ? true : false;
                    if (field_width === undefined) {
                        formattedString = number;
                    } else {
                        if (parseInt(field_width, 10) < 0) {
                            if (zeroPadding)
                                formattedString = number.padEnd(-field_width, '0');
                            else
                                formattedString = number.padEnd(-field_width);
                        } else {
                            if (zeroPadding)
                                formattedString = number.padStart(field_width, '0');
                            else
                                formattedString = number.padStart(field_width);
                        }
                    }
                    if (conversion_specifier === 'X')
                        formattedString = formattedString.toUpperCase();
                    break;
            }
            if (formattedString === '')
                formattedString = args[result[1]];
            buffer += formattedString; // formatted string
        }
        index = result.index + result[0].length;
    }
    if (index !== formatString.length) {
        buffer += formatString.substring(index, formatString.length);
    }
    return buffer;
}