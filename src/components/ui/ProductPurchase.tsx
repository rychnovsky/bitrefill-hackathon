import React, { useCallback, useEffect, useState } from "react";
import { createInvoice, getProduct, ProductResponse } from "~/lib/bitrefillApi";

const ProductPurchase = () => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const handleGetProduct = useCallback(async () => {
    setLoadingProduct(true);
    setProductError(null);
    try {
      const data = await getProduct("test-gift-card-link");
      setProduct(data);
    } catch {
      setProductError("Failed to load reward product.");
    } finally {
      setLoadingProduct(false);
    }
  }, []);

  useEffect(() => {
    handleGetProduct();
  }, [handleGetProduct]);

  const handlePurchase = useCallback(async () => {
    if (!product) return;
    const data = await createInvoice({
      products: [
        {
          product_id: product.data.id,
          package_id: product.data.packages[0].id,
          value: parseInt(product.data.packages[0].value),
          quantity: 1,
        },
      ],
      auto_pay: true,
      payment_method: "balance",
    });
    console.log("data", data);
  }, [product]);

  return (
    <>
      {productError && (
        <div className="text-red-600 mt-2 text-sm">{productError}</div>
      )}
      {loadingProduct ? (
        <div>Loading reward...</div>
      ) : product && product.data ? (
        <div className="border-[1px] border-gray-800 rounded-lg p-4 py-8 flex flex-col items-center">
          <div className="mb-2 font-semibold">{product.data.name}</div>
          <div className="mb-2">{product.data.packages[0]?.value}</div>
          {product.data.image && (
            <img src={product.data.image} className="mx-auto mb-2 max-h-32" />
          )}
          <div className="text-sm text-gray-700 mb-1">
            Country: {product.data.country_name} ({product.data.country_code})
          </div>
          <div className="text-sm text-gray-700 mb-1">
            In Stock: {product.data.in_stock ? "Yes" : "No"}
          </div>
          {product.data.packages && (
            <div className="text-sm text-gray-700 mb-1">
              Price: {product.data.packages[0]?.price} {product.data.currency}
            </div>
          )}
          {product.data.range && (
            <div className="text-sm text-gray-700 mb-1">
              Range: {product.data.range.min} - {product.data.range.max} (step{" "}
              {product.data.range.step})
            </div>
          )}
          <button
            className="mt-6 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            onClick={handlePurchase}
          >
            Purchase Gift Card
          </button>
        </div>
      ) : (
        <div className="text-red-600">No reward data.</div>
      )}
    </>
  );
};

export default ProductPurchase;
