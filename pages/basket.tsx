import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BasketProduct from "../components/basketproduct";
import Header from "../components/header";
import { selectItems } from "../slices/basketSlice";
import nookies from "nookies";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import {PriceFragment, useCreateCheckoutMutation} from "@/saleor/api";
import {useRegions} from "@/components/RegionsProvider";
import {useUser} from "@/lib/useUser";

function Basket() {
  const router = useRouter();
  const { formatPrice, currentChannel } = useRegions();
  const tempItems = useSelector(selectItems);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useState({});

    const [createCheckout] = useCreateCheckoutMutation();
    const { user } = useUser();

  useEffect(() => {
    const dataCookie = nookies.get();
    try {
      setCookie(JSON.parse(dataCookie.user));
    } catch (err) {
      setCookie(dataCookie.user);
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

    useEffect(() => {
        setItems(tempItems);
    }, [tempItems]);

  const createCheckoutSession = async () => {
    setLoading(true);

      const lines = items.map(item => ({
          quantity: item.quantity,
          variantId: item.id,
      }));

      const { data: createCheckoutData } = await createCheckout({
          variables: {
              email: user?.email,
              channel: currentChannel.slug,
              lines: lines,
          },
      });
      console.log(JSON.stringify(createCheckoutData));

    const errorMessages = createCheckoutData?.checkoutCreate?.errors.map((e) => e.message || "") || [];
    if (errorMessages.length === 0) {
        const checkoutUrl = new URL(`https://www.eminstore.com/checkout/`);
        checkoutUrl.searchParams.append('checkout', createCheckoutData?.checkoutCreate?.checkout?.id);
        checkoutUrl.searchParams.append('locale', `en-US`);
        checkoutUrl.searchParams.append('channel', `default-channel`);
        checkoutUrl.searchParams.append('saleorApiUrl', process.env.NEXT_PUBLIC_API_URI!);
        window.location.href = checkoutUrl.toString();
    } else {
        alert(errorMessages.join("\n"));
    }
  };

    // 计算单个商品总价格
    const calculateProductTotalPrice = (quantity: number, price?: PriceFragment) => {
        if (!price) {
            return '';
        }
        const totalPrice = (price.amount || 0) * quantity;
        return formatPrice({ ...price, amount: totalPrice });
    };

    // 计算购物车中所有商品的总价格
    const calculateCartTotalPrice = () => {
        let totalPrice = 0;
        for (const item of items) {
            totalPrice += (item.pricing?.price?.gross?.amount || 0) * item.quantity;
        }
        return totalPrice;
    };
    const calculateCartTotalPriceStr = () => {
        if (!items || items.length === 0) {
            return formatPrice({ amount: 0 } as PriceFragment);
        }

        return formatPrice({ ...items[0].pricing?.price?.gross, amount: calculateCartTotalPrice() });
    };

    const freeShippingThreshold = 49.0;
    const getRemainingAmountForFreeShipping = () => {
        let totalPrice = 0;
        for (const item of items) {
            totalPrice += (item.pricing?.price?.gross?.amount || 0) * item.quantity;
        }
        if (totalPrice >= freeShippingThreshold) {
            return 0;
        } else {
            return freeShippingThreshold - totalPrice;
        }
    };

    const [promoCode, setPromoCode] = useState('');

    const handleInputChange = (event) => {
        setPromoCode(event.target.value.toUpperCase());
    };

  return (
    <>
      <Head>
        <title>eminstore | Basket</title>
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-6xl mx-auto pt-20 px-5">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <div className="md:col-span-2 md:mr-5">
              <div className="">
                <div className="shadow-lg rounded-xl bg-cusblack text-white px-5 py-3">
                  <h1 className="font-semibold text-lg md:text-xl mb-1">
                      {calculateCartTotalPrice() >= freeShippingThreshold
                          ? "Your order qualifies for FREE SHIPPING"
                          : `Order for an additional $${getRemainingAmountForFreeShipping()} to receive FREE SHIPPING`}
                  </h1>
                  <p className="text-xs mb-1 text-gray-100">
                      Free shipping on orders over $49. Orders ship within 3-7 business days.
                  </p>
                </div>
                <div className="rounded-xl bg-white px-5 pt-5 mt-5 shadow-lg overflow-hidden">
                  <p>Your Basket ({items.length})</p>
                  <div className="pt-5 pb-2">
                    {items.length > 0 &&
                      items.map((item, idx) => (
                        <BasketProduct idx={idx} key={item.id} item={item} />
                      ))}
                    {items.length === 0 && (
                      <div className="text-gray-400 text-sm mb-10">
                        <img
                          className="md:w-1/3 object-cover w-full mx-auto"
                          src="\empty-cart.png"
                          alt=""
                        />
                        <p className="text-center">
                          Your basket is empty,
                          <br />
                          to start shopping click{" "}
                          <span className="underline">
                            <Link href="/shop">here</Link>
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 md:mt-0 col-span-1">
              <div className="rounded-xl bg-white shadow-lg py-6 px-5">
                <h1 className="text-cusblack font-bold text-md">SUMMARY</h1>
                  <div className="px-4 py-2.5 text-xs font-medium flex place-items-center text-gray-400 border border-gray-200 rounded-md my-4">
                      <svg
                          className="w-5 h-5 transform scale-110 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
                          />
                      </svg>
                      <input
                      type="text"
                      className={`border-0 bg-transparent w-full py-1 font-medium placeholder-gray-400 focus:outline-none`}
                      placeholder="DO YOU HAVE PROMO CODE?"
                      value={promoCode}
                      onChange={handleInputChange}
                      />
                  </div>

                <div className="text-sm pt-1 font-semibold pb-2 border-b border-cusblack flex justify-between place-items-center">
                    <p className="">SUBTOTAL</p>
                    <p className="font-semibold text-right text-cusblack">{ calculateCartTotalPriceStr() }</p>
                </div>

                <div className="my-3 border-b border-cusblack pb-2">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between place-items-center text-sm mb-1"
                        >
                            <p className="pr-3">{item.productName}{item.productVariantCount > 1 ? `（${item.name}）` : ''}</p>
                            <p className="font-semibold text-right text-cusblack">{ calculateProductTotalPrice(item.pricing?.price?.gross, item.quantity) }</p>
                        </div>
                    ))}
                    <div className="flex justify-between place-items-center text-sm mb-1">
                        <p>TAX</p>
                        <p>FREE</p>
                    </div>
                </div>

                <div className="flex justify-between place-items-center font-semibold">
                    <p>TOTAL</p>
                    <p className="font-semibold text-right text-cusblack">{ calculateCartTotalPriceStr() }</p>
                </div>

                <button
                  disabled={!items.length}
                  onClick={createCheckoutSession}
                  className="py-2 px-3 disabled:cursor-not-allowed text-white w-full mt-6 rounded-lg bg-cusblack "
                >
                  {!loading ? (
                    <span className="flex justify-center place-items-center">
                      CHECKOUT
                    </span>
                  ) : (
                    <img
                      className="w-6 h-6 mx-auto"
                      src="/Rolling-1s-200px-2.gif"
                      alt=""
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Basket;
