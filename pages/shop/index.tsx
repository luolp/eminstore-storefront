import React, { useEffect, useState } from "react";
import CardSkeleton from "../../components/cardskeleton";
import Layout from "../../components/layout";
import Productcard from "../../components/productcard";
import { useSelector } from "react-redux";
import { recentCategory } from "../../slices/categorySlice";
import Head from "next/head";

import { ApolloQueryResult } from "@apollo/client";
import {
    CategoryPathsDocument,
    CategoryPathsQuery,
    CollectionPathsDocument,
    CollectionPathsQuery,
    ProductCollectionDocument,
    ProductCollectionQuery,
    LanguageCodeEnum,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";
import { useRegions } from "@/components/RegionsProvider";

export async function getStaticProps() {

    // 所有分类
    const categorieResult: ApolloQueryResult<CategoryPathsQuery | undefined> =
        await serverApolloClient.query({
            query: CategoryPathsDocument,
            variables: {},
        });
    const categorieEdges = categorieResult.data?.categories?.edges || [];
    const data = categorieEdges.map((edge) => edge.node);

    // 所有集合
    const collectionResult: ApolloQueryResult<CollectionPathsQuery | undefined> =
        await serverApolloClient.query({
            query: CollectionPathsDocument,
            variables: {
                channel: "default-channel"
            },
        });

    const collectionEdges = collectionResult.data?.collections?.edges || [];
    const dataTypes = collectionEdges.map((edge) => edge.node);
  // 目录
    //  {"_id":"611908b3347c310cb83f11a1","name":"Nike product","slug":"nike-product","published_at":"2021-08-15T12:29:42.911Z","createdAt":"2021-08-15T12:29:39.985Z","updatedAt":"2021-08-15T12:29:43.069Z","__v":0,"id":"611908b3347c310cb83f11a1"}
  // const res = await fetch(process.env.NEXT_PUBLIC_APIURL + "/categories");
  // const data = await res.json();
  // 集合
  // const resTypes = await fetch(process.env.NEXT_PUBLIC_APIURL + "/types");
  // const dataTypes = await resTypes.json();
  // 所有的商品
  //  {"_id":"61190d98cd0bde22e8960771","name":"Adidas Superstar 20s","slug":"adidas-superstar-20s","color":"Black/White","price":"1249000","published_at":"2021-08-15T12:50:35.569Z","createdAt":"2021-08-15T12:50:32.330Z","updatedAt":"2021-08-17T23:49:55.279Z","__v":0,"id":"61190d98cd0bde22e8960771","category":"Adidas","type":"Shoes","images":["https://i.ibb.co/5vBY1FM/Superstar-Shoes-Black-EG4959-01-standard.jpg","https://i.ibb.co/C9fXhC1/OIP-1.jpg"]}
  // const resItems = await fetch(
  //   process.env.NEXT_PUBLIC_APIURL + `/items?_sort=published_at:DESC`
  // );
  // const dataItems = await resItems.json();
    const productResult: ApolloQueryResult<ProductCollectionQuery | undefined> =
        await serverApolloClient.query({
            query: ProductCollectionDocument,
            variables: { channel: 'default-channel', locale: 'EN_US' }
        });
    const productEdges = productResult.data?.products?.edges || [];
    const dataItems = productEdges.map((edge) => edge.node);
    console.log(dataItems);

  return {
    props: {
        data,
      dataItems,
        dataTypes,
    },
    revalidate: 5,
  };
}

function Category({ data, dataItems, dataTypes }) {
    const { query } = useRegions();
    console.log(query);

  const [sort, setSort] = useState(0);
  const recent_category = useSelector(recentCategory);
  console.log(recent_category);
  const data_items = dataItems
    .filter((item) => {
      if (recent_category.length > 0) {
        return item.category.name == recent_category;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      if (sort === 1) {
        return a.pricing.priceRange.start.gross.amount - b.pricing.priceRange.start.gross.amount;
      }
      if (sort === 2) {
        return b.pricing.priceRange.start.gross.amount - a.pricing.priceRange.start.gross.amount;
      }
      return true;
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      <Head>
        <title>eminstore | Shop</title>
      </Head>
      <Layout categories={data} setSort={setSort} types={dataTypes}>
        {!loading ? (
          data_items.length < 1 ? (
            <p className="col-span-full mx-auto text-sm text-gray-400">
              No item found
            </p>
          ) : (
            data_items.map((item) => (
              <Productcard key={item.slug} item={item} />
            ))
          )
        ) : (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
      </Layout>
    </>
  );
}

export default Category;
