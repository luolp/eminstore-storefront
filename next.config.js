const checkoutEmbededInStorefrontPath = "/saleor-app-checkout";

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
    trailingSlash: true,
      async rewrites() {
          return [
              {
                  source: '/checkout/',
                  destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}/checkout-spa/`,
              },
              {
                  source: `${checkoutEmbededInStorefrontPath}/`,
                  destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}/`,
              },
              {
                  source: `${checkoutEmbededInStorefrontPath}/:path*/`,
                  destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}/:path*/`,
              },
              {
                  source: `${checkoutEmbededInStorefrontPath}/:path*`,
                  destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}/:path*`,
              }
          ];
      },
};