module.exports = {
  images: {
    domains: ["data.eminstore.com"],
  },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "x-content-type-options",
                        value: "nosniff",
                    },
                    { key: "x-xss-protection", value: "1" },
                    { key: "x-frame-options", value: "DENY" },
                    {
                        key: "strict-transport-security",
                        value: "max-age=31536000; includeSubDomains",
                    },
                ],
            },

            {
                source: "/checkout/(.*)",
                headers: [{ key: "x-frame-options", value: "ALLOWALL" }],
            },
        ];
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