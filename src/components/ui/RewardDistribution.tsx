import React from "react";
import { CreateInvoiceResponse } from "~/lib/bitrefillApi";

type Props = {
  purchasedProduct: CreateInvoiceResponse;
};

const RewardDistribution: React.FC<Props> = ({ purchasedProduct }) => {
  return (
    <>
      {/* Step 4: Show purchased product details */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-bold mb-4">Purchase Complete</h2>
        {purchasedProduct ? (
          <pre className="text-left text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(purchasedProduct, null, 2)}
          </pre>
        ) : (
          <div className="text-red-600">No purchase data.</div>
        )}
      </div>
    </>
  );
};

export default RewardDistribution;
