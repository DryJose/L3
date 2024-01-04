import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoriteService } from '../../services/favorite.service';

class ProductDetail extends Component {
	more: ProductList;
	product?: ProductData;

	constructor(props: any) {
		super(props);

		this.more = new ProductList();
		this.more.attach(this.view.more);
	}

	async render() {
		const urlParams = new URLSearchParams(window.location.search);
		const productId = Number(urlParams.get('id'));

		const productResp = await fetch(`/api/getProduct?id=${productId}`);
		this.product = await productResp.json();

		if (!this.product) return;

		const { id, src, name, description, salePriceU } = this.product;

		const isInCart = await cartService.isInCart(this.product);
		const isInFavorite = await favoriteService.isInFavorite(this.product);
		if (isInCart) this._setInCart();
		if (isInFavorite) this._setInFavorite();

		this.view.photo.setAttribute('src', src);
		this.view.title.innerText = name;
		this.view.description.innerText = description;
		this.view.price.innerText = formatPrice(salePriceU);
		this.view.btnBuy.onclick = this._toggleCart.bind(this, isInCart);
		this.view.btnFavorite.onclick = this._toggleFavorite.bind(this, isInFavorite);

		fetch(`/api/getProductSecretKey?id=${id}`)
			.then((res) => res.json())
			.then((secretKey) => {
				this.view.secretKey.setAttribute('content', secretKey);
			});

		fetch('/api/getPopularProducts')
			.then((res) => res.json())
			.then((products) => {
				this.more.update(products);
			});
	}


	private _toggleCart(isInCart: Boolean) {
		if (!this.product) return;
		if (isInCart) {
			cartService.removeProduct(this.product);
			this._removeFromCart();
		} else {
			cartService.addProduct(this.product);
			this._setInCart();
		}
		this.view.btnBuy.onclick = this._toggleCart.bind(this, !isInCart);
	}

	private _toggleFavorite(isInFavorite: Boolean) {
		if (!this.product) return;
		if (isInFavorite) {
			favoriteService.removeProduct(this.product);
			this._removeFromFavorite();
		} else {
			favoriteService.addProduct(this.product);
			this._setInFavorite();
		}
		this.view.btnFavorite.onclick = this._toggleFavorite.bind(this, !isInFavorite);
	}

	private _setInCart() {
		this.view.btnBuy.innerText = '✓ В корзине';
		this.view.btnBuy.classList.add('disabled');
	}

	private _removeFromCart() {
		this.view.btnBuy.innerText = 'В корзину';
		this.view.btnBuy.classList.remove('disabled');
	}

	private _setInFavorite() {
		this.view.btnFavorite.querySelector('use').setAttribute('xlink:href', '#heart2')
		// localforage.clear();
	}

	private _removeFromFavorite() {
		this.view.btnFavorite.querySelector('use').setAttribute('xlink:href', '#heart')
	}
}

export const productDetailComp = new ProductDetail(html);
