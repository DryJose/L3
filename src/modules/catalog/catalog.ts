import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';
import { metricService } from '../../services/metric.service';
import { userService } from '../../services/user.service';
import { searchComp } from '../search/search';

class Catalog extends Component {
  productList: ProductList;
  search?: typeof searchComp;

	constructor(props: any) {
		super(props);
		this.productList = new ProductList();
		this.productList.attach(this.view.products);
    // searchComp.before(this.view.products);
  }

  async render() {
    await userService.init();
    const productsResp = await fetch('/api/getProducts', {
      headers: {
        'UserID': window.userId
      }
    });
   
    const products = await productsResp.json();
    this.productList.update(products);
    let threeProduct = products.slice(0,3);
		searchComp.before(this.view.products, threeProduct);

    metricService.postNavigateEvent();
  }
}

export const catalogComp = new Catalog(html);
