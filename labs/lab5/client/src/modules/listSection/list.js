import Mustache from 'mustache';
import './list.scss';

class ListSection {
	constructor() {
		this.menuBtnHandler = this.menuBtnHandler.bind(this);
	}

	menuBtnHandler() {
		return fetch(`http://localhost:3000/templates/listSection.mst`)
			.then(raw => raw.text())
			.then(templateStr => {
				const renderedHtmlStr = Mustache.render(templateStr);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('root');
				appEl.innerHTML = htmlStr;

				this.renderList();
			})
			.catch(err => console.log(err));
	}

	renderList() {
		// document.getElementById('root').innerHTML = 'LOADING';

		Promise.all([
			fetch('http://localhost:3000/templates/list.mst').then(x => x.text()),
			fetch('http://localhost:3000/api/universities?limit=999').then(x => x.json()),
		])
			.then(([templateStr, itemsData]) => {
				const dataObject = { items: itemsData.results };
				const renderedHtmlStr = Mustache.render(templateStr, dataObject);
				return renderedHtmlStr;
			})
			.then(htmlStr => {
				const appEl = document.getElementById('list');
				appEl.innerHTML = htmlStr;
			})
			.catch(err => console.error(err));
	}
}

export default new ListSection();
