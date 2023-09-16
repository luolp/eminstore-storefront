import { OrderFragment, useOrderQuery } from "@/saleor/api";

export const useOrder = (id: string) => {
  const [{ data, fetching: loading }] = useOrderQuery({
    variables: { languageCode: 'EN_US', id },
  });

  return { order: data?.order as OrderFragment, loading };
};
