import html from './search.tpl.html';
import { Component } from '../component';
import { ProductData } from 'types';

export class Search extends Component {
	constructor(props: any) {
		super(props);
	}


	before($root: HTMLElement, array: ProductData[]) {
		let threeLinks = this.view.root.querySelectorAll('.good');
		threeLinks.forEach((el, index) => {
			el.textContent = array[index].name.toLowerCase().split(' ').slice(0, 2).join(' ');
			el.setAttribute('href', `product?id=${array[index].id}`)
		})
		$root.before(this.view.root);
	}

	async render() {
	}
}

export const searchComp = new Search(html);