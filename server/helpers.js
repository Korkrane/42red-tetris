const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvwxyz0123456789')
{
	let id= '';
	while(len--){
		id += chars[Math.floor(Math.random() * chars.length)]
	}
	return id;
}

function createName()
{
		return uniqueNamesGenerator({
				dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
				length: 3,
				style: 'lowerCase',
				separator: '-'
			});
}

module.exports = { createId, createName };