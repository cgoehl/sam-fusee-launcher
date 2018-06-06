// This will be very hacky

const fs = require('fs');
const path = require('path');

const toHexStr = num => {
	const digits = num.toString(16);
	return `0x${digits.length == 1 ? '0' : ''}${digits.toUpperCase()}`
}


const buffer = fs.readFileSync(process.argv[2]);

let binaryString = '\t';
let i = 0;
let columns = 0;

while (i < buffer.byteLength) {
	binaryString += `${toHexStr(buffer.readUInt8(i))}, `;
	i++;
	columns++;
	if (columns % 16 == 0) {
		columns = 0;
		binaryString += '\n\t';
	}
}

const content = `#include <Arduino.h>

#define FUSEE_BIN_SIZE ${buffer.byteLength}
const PROGMEM byte fuseeBin[FUSEE_BIN_SIZE] = {
${binaryString}
};
`

fs.writeFileSync(path.join(__dirname, 'src', 'payload.h'), content);

console.log(`Processed ${buffer.byteLength} bytes.`);