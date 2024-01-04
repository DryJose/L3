import { Component } from '../component';
// import { Product } from '../product/product';
import html from './favorite.tpl.html';
// import { ProductData } from 'types';
import {favoriteService} from "../../services/favorite.service";
// import { ProductList } from '../productList/productList';
import { ProductList } from '../productList/productList';

class Favorite extends Component {
    // products!: ProductData[];
    // productList!: ProductList[];
    favoriteProducts: ProductList;

    constructor(props: any) {
		super(props);

		this.favoriteProducts = new ProductList();
		this.favoriteProducts.attach(this.view.favorite);
	}

	async render() {
		let products = await favoriteService.get();
		this.favoriteProducts.update(products);

	}

}

export const favoriteComp = new Favorite(html);
