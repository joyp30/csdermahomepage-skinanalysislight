const fs = require('fs');
const pdf = require('pdf-parse');

console.log('pdf object:', pdf);

const dataBuffer = fs.readFileSync('/Users/seyoung/Downloads/홈페이지과 얼굴분석 탑재 홈페이지/(25.11.21)서울피부과프로그램.pdf');

try {
    if (typeof pdf === 'function') {
        pdf(dataBuffer).then(function (data) {
            console.log(data.text);
        });
    } else if (pdf.default && typeof pdf.default === 'function') {
        pdf.default(dataBuffer).then(function (data) {
            console.log(data.text);
        });
    } else {
        console.error('Cannot find PDF parsing function');
    }
} catch (error) {
    console.error('Error reading PDF:', error);
}
