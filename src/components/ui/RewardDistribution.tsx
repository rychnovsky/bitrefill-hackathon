import { sdk } from "@farcaster/frame-sdk";
import React, { useEffect, useState } from "react";
import {
  CreateInvoiceResponse,
  getOrderById,
  GetOrderByIdResponse,
} from "~/lib/bitrefillApi";

type Props = {
  purchasedProduct: CreateInvoiceResponse;
  winner: {
    fid: number;
    username: string;
  };
  channelKey: string;
};

const RewardDistribution: React.FC<Props> = ({
  purchasedProduct,
  winner,
  channelKey,
}) => {
  const [orderDetails, setOrderDetails] = useState<GetOrderByIdResponse | null>(
    null
  );
  const invoice = purchasedProduct.data;

  const order = invoice.orders[0];

  useEffect(() => {
    if (!order?.id) {
      return;
    }
    getOrderById(order.id).then((orderDetails) => {
      setOrderDetails(orderDetails);
    });
  }, [order.id]);

  const notifyUser = async () => {
    await sdk.actions.composeCast({
      text: `User @${winner.username} has been drawn as the winner of the Bitrefill gift card. Congrats!`,
      embeds: ["https://bitrefill.com/gift-card.png"],
      channelKey,
    });
  };

  return (
    <>
      {/* Step 4: Show purchased product details */}
      <div className="border-[1px] border-gray-800 rounded-lg p-4 py-8 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Gift Card Purchased</h2>
        {orderDetails?.data.redemption_info.instructions}
        <div className="text-sm text-gray-500 mt-2">Redemption code:</div>
        <div
          className="text-sm font-bold"
          onClick={() => {
            navigator.clipboard.writeText(
              orderDetails?.data.redemption_info.code ?? ""
            );
          }}
        >
          {orderDetails?.data.redemption_info.code}
        </div>
        <button
          className="mt-6 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          onClick={notifyUser}
        >
          Share winner
        </button>
      </div>
    </>
  );
};

export default RewardDistribution;
