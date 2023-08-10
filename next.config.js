module.exports = {
  images: {
    domains: ["data.eminstore.com"],
  },
  async rewrites() {
      return [
          {
              source: '/checkout',
              destination: 'https://checkout.eminstore.com/checkout-spa',
          },
      ];
  },
};