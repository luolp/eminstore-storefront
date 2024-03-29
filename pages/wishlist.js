import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/header";
import WishProduct from "../components/wishproduct";
import { selectWishItems } from "../slices/wishlistSlice";
import Head from "next/head";

function WishList() {
  const data = useSelector(selectWishItems);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(data);
  });

    const seoTitle = "Wishlist - Save Your Favorite Products | eminstore";
    const seoDescription = "Create and manage your wishlist at Eminstore. Save your favorite products and plan your future purchases. Explore a curated list of items you love.";

    return (
    <>
      <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />

          <meta name="twitter:card" content="summary" />
          {/* 下面4个是和twitter共用的 */}
          <meta property="og:url" content="https://www.eminstore.com/wishlist/" />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:image" content="https://www.eminstore.com/eminstore.png" />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="eminstore" />
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-6xl mx-auto pt-20 px-5 min-h-screen">
          <div className="bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 md:py-6 md:px-6 pb-3">
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 px-4 md:px-0">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <WishProduct item={item} key={item.slug} idx={idx} />
                ))
              ) : (
                <div className="text-sm text-gray-400 col-span-2 md:col-span-3 lg:col-span-4 flex justify-center place-items-center">
                  Your wishlist is empty
                </div>
              )}
            </div>

            <div className="overflow-hidden md:pl-10 row-start-1 md:col-start-3 mb-6 md:mb-0 h-48 md:h-full">
              <div className="relative">
                <div className="text-white flex justify-center place-items-center text-2xl absolute w-full rounded-xl bg-gray-600 ml-10 bg-opacity-60 font-bold right-0 top-0 h-48 md:h-full">
                  <h1>WISHLIST</h1>
                </div>
                <img
                  src="\wishlist.jpg"
                  className="object-cover rounded-xl w-full"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WishList;
