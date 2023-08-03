import React from "react";
import { useState } from "react";
import Router from "next/router";
import { ApolloQueryResult } from "@apollo/client";
import {ProductCollectionDocument, ProductCollectionQuery, ProductFilterInput} from "@/saleor/api";
import {serverApolloClient} from "@/lib/auth/useAuthenticatedApolloClient";

function Search() {
  // const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  // const [debouncedFilter, setDebouncedFilter] = React.useState<ProductFilterInput>({});
  const handleChange = async (e) => {
      let debouncedFilter = {};
      if (e.target.value) {
          debouncedFilter = { search: e.target.value };
      }

      const productResult: ApolloQueryResult<ProductCollectionQuery | undefined> =
          await serverApolloClient.query({
              query: ProductCollectionDocument,
              variables: { filter: debouncedFilter, channel: 'default-channel', locale: 'EN_US' }
          });
      const productEdges = productResult.data?.products?.edges || [];
      const products = productEdges.map((edge) => edge.node);

    setData(products);
  };
  return (
    <div className="flex relative group md:ml-auto justify-between pr-4 place-items-center flex-grow h-full rounded-3xl bg-white">
      <input
        onChange={handleChange}
        className="text-xs group pl-4 rounded-3xl p-2.5 focus:outline-none w-full text-cusblack"
        type="text"
        placeholder="Search product"
      />
      <div className="p-5 shadow-lg hidden duration-100 group-focus-within:inline group-active:inline top-11 bg-white absolute rounded-2xl w-full z-20">
        {data.length ? (
          data
            .filter((i, idx) => idx < 4)
            .map((item, idx) => (
              <div onClick={() => Router.push("/product/" + item.slug)}>
                <div
                  key={idx}
                  className="p-2 flex place-items-center cursor-pointer text-xs font-light text-cusblack hover:bg-gray-100 active:bg-gray-200"
                >
                  <span>
                    <img
                      src={item.thumbnail?.url}
                      className="w-7 h-7 mr-1 rounded-lg"
                      alt=""
                    />
                  </span>
                  {item.name}
                </div>
              </div>
            ))
        ) : (
          <p className="text-xs text-cusblack font-light">No item found</p>
        )}
      </div>
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default Search;
