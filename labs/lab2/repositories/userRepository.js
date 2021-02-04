const User = require('../models/user');
const JsonStorage = require('../jsonStorage');

class UserRepository {
	constructor(filePath) {
		this.storage = new JsonStorage(filePath);
	}

	getUsers() {
		return this.storage.readItems();
		/* //?if you need to know the type of array objects
		const items = [];
		for (const item of this.storage.readItems()) {
			items.push(this.getUserByUuid(item.uuid));
		}
		return items;
		*/
	}

	getUserByUuid(uuid) {
		for (const item of this.storage.readItems()) {
			if (item.uuid === uuid) {
				return new User(
					item.uuid,
					item.login,
					item.fullname,
					item.role,
					item.registeredAt,
					item.avaUrl,
					item.isEnabled
				);
			}
		}
		console.log('This index is missing');
		return null;
	}
}

module.exports = UserRepository;
