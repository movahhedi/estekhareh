import Fs from "fs";

const data: Record<number, {
	surah: string,
	ayah: string,
	short: string,
	overall: string,
	marriage: string,
	trade: string,
}> = {};


for (let pageNumber = 1; pageNumber <= 603; pageNumber += 2) {
	const a = await fetch(`https://www.aviny.com/استخاره/${pageNumber}`);
	const text = await a.text();
	const resultIterator = text.matchAll(/<div class="field__label">(.*?)<\/div>[\s\S\n\r]*?<div class="field__item">(.*?)<\/div>/g);
	const result = Array.from(resultIterator);

	if (result.length != 7) {
		console.error("Not 7 fields", pageNumber);
		continue;
	}

	data[pageNumber] = {
		surah: result[1][2],
		ayah: result[2][2],
		short: result[3][2],
		overall: result[4][2],
		marriage: result[5][2],
		trade: result[6][2],
	};

	console.log(pageNumber);
}

// console.log(data);

await Fs.promises.writeFile("./a.json", JSON.stringify(data, null, "\t"));
