export default async ( originSelector, destinationSelector ) => {

	await page.waitForSelector(originSelector)
	await page.waitForSelector(destinationSelector)

	const origin       = await page.$( originSelector ),
		destination    = await page.$( destinationSelector ),
		originBox      = await origin.boundingBox(),
		destinationBox = await destination.boundingBox();

	await page.mouse.move( originBox.x + originBox.width / 2, originBox.y + originBox.height / 2 );
	await page.mouse.down();
	await page.mouse.move( destinationBox.x + destinationBox.width / 2, destinationBox.y + destinationBox.height / 2 );
	return page.mouse.up();

};
