function latinToGreek(str) {
    let newStr = "";
    for (let i=0; i<str.length; i++) {
switch (str[i]) {
    case 'A':
    case 'a':
        newStr += 'Α'; // Greek Alpha
        break;
    case 'B':
    case 'b':
        newStr += 'Β'; // Greek Beta
        break;
    case 'E':
    case 'e':
        newStr += 'Ε'; // Greek Epsilon
        break;
    case 'H':
    case 'h':
        newStr += 'Η'; // Greek Eta
        break;
    case 'I':
    case 'i':
        newStr += 'Ι'; // Greek Iota
        break;
    case 'K':
    case 'k':
        newStr += 'Κ'; // Greek Kappa
        break;
    case 'M':
    case 'm':
        newStr += 'Μ'; // Greek Mu
        break;
    case 'N':
    case 'n':
        newStr += 'Ν'; // Greek Nu
        break;
    case 'O':
    case 'o':
        newStr += 'Ο'; // Greek Omicron
        break;
    case 'T':
    case 't':
        newStr += 'Τ'; // Greek Tau
        break;
    case 'X':
    case 'x':
        newStr += 'Χ'; // Greek Chi
        break;
    case 'Y':
    case 'y':
        newStr += 'Υ'; // Greek Upsilon
        break;
    case 'Z':
    case 'z':
        newStr += 'Ζ'; // Greek Zeta
        break;
    default:
        newStr += str[i].toUpperCase();
        break;
}

    }
    return newStr;
}

export default latinToGreek;