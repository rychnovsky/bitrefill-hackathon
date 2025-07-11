const DEFAULT_PRODUCT = "affiliate-tester";

const getBitrefillProduct = () => {
  const product = localStorage.getItem("bitrefillProduct");
  if (!product) {
    setBitrefillProduct(DEFAULT_PRODUCT);
    return DEFAULT_PRODUCT;
  }
  return product;
};

const setBitrefillProduct = (product: string) => {
  localStorage.setItem("bitrefillProduct", product);
};

export { getBitrefillProduct, setBitrefillProduct };
