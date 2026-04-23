export const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
export const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
export const getCartCount = () => getCart().reduce((sum, item) => sum + item.quantity, 0);

export const addToCart = (product) => {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
    }
    saveCart(cart);
};
