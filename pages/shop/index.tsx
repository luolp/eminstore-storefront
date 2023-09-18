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

    // 所有商品
    const productResult: ApolloQueryResult<ProductCollectionQuery | undefined> =
        await serverApolloClient.query({
            query: ProductCollectionDocument,
            variables: { channel: 'default-channel', locale: 'EN_US' }
        });
    const productEdges = productResult.data?.products?.edges || [];
    const dataItems = productEdges.map((edge) => edge.node);
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
  const [sort, setSort] = useState(0);
  const recent_category = useSelector(recentCategory);
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

    const seoTitle = "Explore Our Shop - Eminstore | Discover a Wide Range of High-Quality Products";
    const seoDescription = "Discover a wide range of high-quality products at Eminstore's online shop. Explore our curated selection and find the perfect items for your needs.";

    return (
    <>
      <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />

          <meta name="twitter:card" content="summary" />
          {/* 下面4个是和twitter共用的 */}
          <meta property="og:url" content="https://www.eminstore.com/shop/" />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:image" content="https://www.eminstore.com/eminstore.png" />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="eminstore" />
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
