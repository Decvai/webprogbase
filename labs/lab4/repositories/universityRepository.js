const University = require('../models/university');

class UniversityRepository {
	async getUniversities() {
		return await University.find();
	}

	async getUniversityById(id) {
		return await University.findById(id);
	}

	addUniversity(universityModel) {
		// this.storage.writeItems(universityModel);

		// const university = new University({
		// 	name: 'NedoKPI',
		// 	country: 'Ukraine',
		// });
		console.log('ADded');
		// await university.save();
	}

	updateUniversity(universityModel) {
		this.storage.writeItems(universityModel);
	}

	deleteUniversity(universityId) {
		const items = this.getUniversities();
		items.splice(universityId, 1);
		this.storage.writeItems(items);
	}
}

module.exports = UniversityRepository;
