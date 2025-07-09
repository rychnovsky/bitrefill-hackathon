import React, { useCallback, useEffect, useState } from "react";
import {
  createInvoice,
  CreateInvoiceResponse,
  getProduct,
  ProductResponse,
} from "~/lib/bitrefillApi";

type Props = {
  onComplete: (res: CreateInvoiceResponse) => void;
};

const ProductPurchase: React.FC<Props> = ({ onComplete }) => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const handleGetProduct = useCallback(async () => {
    setLoadingProduct(true);
    setProductError(null);
    try {
      const data = await getProduct("affiliate-tester");
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
          quantity: 1,
        },
      ],
      auto_pay: true,
      payment_method: "balance",
    });
    console.log("data", data);
    onComplete(data);
  }, [product, onComplete]);

  const value = product?.data.packages[0]?.value;
  const price = (product?.data.packages[0]?.price ?? 0) / 1_000;
  const currency = product?.data.currency;

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
          <div className="mb-2">
            Value: {value} {currency}
          </div>
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
              Price: {price} {currency}
            </div>
          )}

          <div className="w-full h-[0.5px] bg-gray-800 my-4" />

          <span className="text-xs text-gray-500">
            The amount of {price} {currency} will be deducted from your
            Bitrefill balance.
          </span>

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
