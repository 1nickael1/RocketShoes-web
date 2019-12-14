import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';
import { ProductList } from './styles';

function Home(props) {
  const { amount } = props;
  const [products, setProducts] = useState([]);

  async function didMount() {
    const response = await api.get('products');

    const data = response.data.map(p => ({
      ...p,
      priceFormatted: formatPrice(p.price)
    }))

    setProducts(data);
  }

  useEffect(() => {
    didMount();
  }, [])

  function handleAddProduct(id) {
    const { addToCartRequest } = props;
    addToCartRequest(id);
  }

  return (
    <ProductList>
      {products.map(p => (
        <li key={p.id}>
          <img src={p.image} alt={p.title} />
          <strong>{p.title}</strong>
          <span>{p.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProduct(p.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              {amount[p.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}

    </ProductList>
  );
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
