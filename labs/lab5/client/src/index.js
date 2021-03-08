import 'normalize.css';
import 'bootstrap';
import './index.scss';
import createSection from './modules/createSection/create';
import listSection from './modules/listSection/list';

const btns = document.querySelectorAll('.menu__btn');
btns.forEach(btn => {
	const templateName = btn.getAttribute('data-template');

	if (templateName === 'create') {
		btn.addEventListener('click', createSection.menuBtnHandler);
	} else if (templateName === 'list') {
		btn.addEventListener('click', listSection.menuBtnHandler);
	}
});
