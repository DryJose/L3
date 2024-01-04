import { Component } from '../component';
import { Product } from '../product/product';
import html from './favorite.tpl.html';
import { ProductData } from 'types';
import {favoriteService} from "../../services/favorite.service";
import { ProductList } from '../productList/productList';
import { metricService } from '../../services/metric.service';

class Favorite extends Component {
	favoriteProducts: ProductList;
	products!: ProductData[];
 
	constructor(props: any) {
		super(props);
 
		this.favoriteProducts = new ProductList();
		this.favoriteProducts.attach(this.view.favorite);
	}
 
	async render() {
		let products = await favoriteService.get();
		this.favoriteProducts.update(products);
 
		this.products = products;
 
		if (!this.products) {
			return;
		}
 
		if (this.products.length < 1) {
			this.view.root.classList.add('is__empty');
			return;
		}
 
		this.products.forEach((product) => {
			const productComp = new Product(product, { isHorizontal: false });
			productComp.render();
			productComp.attach(this.view.favorites);
		});
 
		metricService.postNavigateEvent();
	}
 }
 
 export const favoriteComp = new Favorite(html);
 