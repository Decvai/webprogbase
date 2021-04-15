export function gotoBottom(query) {
	const element = document.querySelector(query);
	element.scrollTop = element.scrollHeight;
}
