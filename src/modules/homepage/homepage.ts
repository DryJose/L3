import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { metricService } from '../../services/metric.service';
import { userService } from '../../services/user.service';
// import { searchComp } from '../search/search';

class Homepage extends Component {
  popularProducts: ProductList;
  // search: typeof searchComp;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);

    // this.search = new searchComp(['эпатажная бирюлька', 'молодёжная висюлька', 'трендовая шмотка']);
    // this.search.attach(this.view.search);
  }

  async render() {
    await userService.init();
    fetch('/api/getPopularProducts', {
      headers: {
        'UserID': window.userId
      }
    })
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });
      

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  
    metricService.postNavigateEvent();
  }
}

export const homepageComp = new Homepage(html);
