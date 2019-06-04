import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WoocommerceProvider {
	WooCommerce: any;

  constructor() {
    this.WooCommerce = WC({
      url:              "http://localhost:8081/wordpress/",
      consumerKey:      "ck_82797df4a393b777d3f8165cc1d0a03c416aafe1",
      consumerSecret:   "cs_86ef40fc1251e98fa4d63363380bf709d1a48575"
    }); 
  }

  /**
  * Get categories
  * @method getCategories
  * @reference https://woocommerce.github.io/woocommerce-rest-api-docs/#product-category-properties
  */
  getCategories() {
  	let categories: any = [];

  	return new Promise((resolve, reject) => {
	  	this.WooCommerce.getAsync("products/categories")
		  	.then((data) => {
		  		let temp: any[] = JSON.parse(data.body).product_categories;

		  		categories = temp.filter((item) => {
		  			return !item.parent && item.name !== 'Uncategorized';
		  		});

		  		resolve(categories);
		  	}, (error) => {
		  		reject(error);
		  	});
  	});
  }

  /**
  * Get category products by category slug
  * @method getProductsByCategory
  * @param {string} categorySlug 	Category slug
  */
  getProductsByCategorySlug(categorySlug: string) {
  	let products: any = [];

  	return new Promise((resolve, reject) => {
	  	this.WooCommerce.getAsync("products?filter[category]=" + categorySlug)
		  	.then((data) => {
		  		products = JSON.parse(data.body).products;
		  		resolve(products);
		  	}, (error) => {
		  		reject(error);
		  	});
  	});
  }

  /**
  * Get order by id
  * @method getOrderById
  * @param {number} orderId 	Order ID
  */
  getOrderById(orderId: number) {
  	let order: any = null;

  	return new Promise((resolve, reject) => {
	  	this.WooCommerce.getAsync('orders/' + orderId)
		  	.then((data) => {
		  		order = JSON.parse(data.body).order;
		  		resolve(order);
		  	}, (error) => {
		  		reject(error);
		  	});
  	});
  }

  /**
  * Create an order
  * @method createOrder
  */
  createOrder(data) {
		return new Promise((resolve, reject) => {
			this.WooCommerce.post('orders', data, function(err, data, res) {
			  if(err) {
					reject(err);
				}
				else {
			  	resolve([err, data, res]);
				}
			});
  	});
  }

  /**
  * updateOrder
  * @method updateOrder
  * @param {number} orderId 	Order ID
  */
  updateOrder(orderId: number) {
  	let data = {
		  status: 'completed'
		};

		return new Promise((resolve, reject) => {
			this.WooCommerce.put('orders/' + orderId, data, function(err, data, res) {
				if(err) {
					reject(err);
				}
				else {
			  	resolve([err, data, res]);
				}
			});
  	});
  }

}
