import Fs from "fs";

for (let pageNumber = 1; pageNumber <= 604; pageNumber++) {
	const a = await fetch(`https://www.aviny.com/sites/default/files/estekhare/chapters/p${("" + pageNumber).padStart(3, "0")}.gif`);

	if (!a.ok) {
		console.error("BAD", pageNumber);
	}

	const blob = await a.arrayBuffer();
	await Fs.promises.writeFile(`./images/${pageNumber}.gif`, Buffer.from(blob));

	console.log(pageNumber);
}
