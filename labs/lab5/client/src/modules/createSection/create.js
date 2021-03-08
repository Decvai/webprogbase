import './create.scss';
import $ from 'jquery';
import Mustache from 'mustache';

const modalConfirmBtn = document.getElementById('deleteConfirm');

class CreateSection {
	constructor() {
		this.lastCreated = { items: [] };
		this.currentItemId = 5;

		this.menuBtnHandler = this.menuBtnHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.renderList = this.renderList.bind(this);
		this.showProfile = this.showProfile.bind(this);
		this.confirmBtnHandler = this.confirmBtnHandler.bind(this);
		modalConfirmBtn.addEventListener('click', this.confirmBtnHandler);
	}

	menuBtnHandler() {
		return fetch(`http://localhost:3000/templates/createSection.mst`)
			.then(raw => raw.text())
			.then(templateStr => {
				const renderedHtmlStr = Mustache.render(templateStr);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('root');
				appEl.innerHTML = htmlStr;

				this.renderList();
				const form = document.querySelector('.create__form');
				form.addEventListener('submit', this.submitHandler);
			})
			.catch(err => console.log(err));
	}

	submitHandler(e) {
		e.preventDefault();

		const university = {
			name: e.target[0].value,
			country: e.target[1].value,
			numOfStudents: +e.target[2].value,
			campus: +e.target[3].value,
			foundationDate: e.target[4].value,
		};

		const file = e.target[5].files[0];
		const formData = new FormData();
		formData.append('image', file);
		formData.append('university', JSON.stringify(university));

		document.querySelector('.create__form').reset();

		fetch('http://localhost:3000/api/universities', {
			method: 'POST',
			body: formData,
		})
			.then(response => response.json())
			.then(jsonRes => {
				this.lastCreated.items.unshift(jsonRes);
				this.renderList();
			});
	}

	renderList() {
		fetch('http://localhost:3000/templates/list.mst')
			.then(x => x.text())
			.then(templateStr => {
				const renderedHtmlStr = Mustache.render(templateStr, this.lastCreated);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('list');
				appEl.innerHTML = htmlStr;

				const listLinks = document.querySelectorAll('.list__link');
				if (listLinks) {
					listLinks.forEach(link => {
						link.addEventListener('click', this.showProfile);
					});
				}
			})
			.catch(err => console.error(err));
	}

	showProfile(e) {
		const elId = e.target.dataset.id;
		this.currentItemId = elId;

		fetch('http://localhost:3000/templates/profile.mst')
			.then(x => x.text())
			.then(templateStr => {
				const entity = this.lastCreated.items.find(e => e._id === elId);
				const renderedHtmlStr = Mustache.render(templateStr, entity);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const profileEl = document.getElementById('profile');
				profileEl.innerHTML = htmlStr;
			})
			.catch(err => console.log(err));
	}

	confirmBtnHandler(e) {
		const id = this.currentItemId;
		fetch(`http://localhost:3000/api/universities/${id}`, {
			method: 'DELETE',
		})
			.then(x => x.json())
			.then(response => {
				if (response.deletedCount > 0) {
					const index = this.lastCreated.items.findIndex(item => item._id === id);
					if (index !== -1) {
						const profile = document.getElementById('profile');
						profile.innerHTML = '';
						this.lastCreated.items.splice(index, 1);
						this.renderList();
					} else {
						console.log('Index not found');
					}
					$('#deleteModal').modal('hide');
				} else {
					console.log('No entity with this id');
				}
			})
			.catch(err => console.log(err));
	}
}

export default new CreateSection();
