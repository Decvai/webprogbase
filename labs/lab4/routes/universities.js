const { Router } = require('express');
const router = Router();

const PORT = process.env.PORT || 3000;
const http = require('http');

const University = require('../models/university');
const Specialty = require('../models/specialty');

const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository('data/media.json');

router.get('/', (req, res) => {
	const name = req.query.name;
	const currentPage = req.query.page || 1;
	http.get(`http://localhost:${PORT}/api/universities?page=${currentPage}&name=${name || ''}`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const universities = JSON.parse(rawData);

		universities.page = [...Array(universities.numOfPages + 1).keys()].slice(1);

		// console.log(universities);
		res.render('university/universities', {
			title: 'Universities',
			isUniversities: true,
			universities,
			name,
			currentPage,
		});
	});
});

router.get('/new', async (_, res) => {
	const specialties = await Specialty.find().lean();

	res.render('university/newUniversity', {
		title: 'Create new university',
		specialties,
	});
});

router.post('/new', async (req, res) => {
	const university = new University({
		name: req.body.name,
		country: req.body.country,
		...(req.body.numOfStudents && { numOfStudents: req.body.numOfStudents }),
		...(req.body.campus && { campus: req.body.campus }),
		...(req.body.foundationDate && { foundationDate: req.body.foundationDate }),
		...(req.files && { image: `/api/media/${req.files.image.md5}` }),
		specialty: req.body.specialty,
	});

	await university.save();

	// if (req.files) {
	// 	const image = {};
	// 	image._id = req.files.image.md5;
	// 	image.path = `./uploads/${req.files.image.name}`;

	// 	const images = mediaRepository.getMedia();
	// 	const isImage = images.find(img => img._id === image._id);

	// 	if (!isImage) {
	// 		req.files.image.mv('./uploads/' + req.files.image.name);
	// 		images.push(image);
	// 		mediaRepository.addMedia(images);
	// 	}
	// }

	// console.log(university);
	res.status(201).redirect(`/universities/${university._id}`);
});

router.get('/:id', (req, res) => {
	http.get(`http://localhost:${PORT}/api/universities/${req.params.id}`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const university = JSON.parse(rawData);

		// console.log(university);
		res.render('university/university', {
			title: university.name,
			university,
		});
	});
});

router.post('/:id', async (req, res) => {
	// const apiReqToUniversity = http.request(
	// 	{
	// 		hostname: 'localhost',
	// 		port: PORT,
	// 		path: `/api/universities/${req.body.id}`,
	// 		method: 'DELETE',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 	},
	// 	apiRes => {
	// 		console.log(`statusCode: ${apiRes.statusCode}`);

	// 		apiRes.on('data', d => {
	// 			process.stdout.write(d);
	// 		});
	// 	}
	// );
	// apiReqToUniversity.on('error', error => {
	// 	console.error(error);
	// });

	// apiReqToUniversity.write(req.body.id);
	// apiReqToUniversity.end();

	await University.deleteOne({ _id: req.body.id });

	res.status(200).redirect('/universities');
});

module.exports = router;
