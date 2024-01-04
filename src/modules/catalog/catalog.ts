import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';
import { metricService } from '../../services/metric.service';
import { userService } from '../../services/user.service';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
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

    metricService.postNavigateEvent();
  }
}

export const catalogComp = new Catalog(html);
