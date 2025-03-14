import { useState } from "react";
import { format } from "date-fns";
import { formatToRupiah, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OrderActions from "./orders/OrderActions";
import { useShopStore } from "@/store/useShopStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";

export default function OrdersDisplay() {
  const location = useLocation();
  const { orders } = useShopStore();
  const [filter, setFilter] = useState("all");

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.orderStatus === filter
  );

  return (
    <div className="container mx-auto py-3 md:py-6 px-2">
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Semua Status
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "success" ? "default" : "outline"}
          onClick={() => setFilter("success")}
        >
          Success
        </Button>
      </div>

      <ScrollArea className="h-96 py-4 border-t border-b">
        {filteredOrders.map((order) => (
          <div className="border rounded-lg p-4 mb-4" key={order.id}>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-6">
                  <p className="font-semibold">
                    Order No. : {order.orderNumber}
                  </p>
                  <span
                    className={cn(
                      order.orderStatus === "pending"
                        ? "bg-red-500"
                        : "bg-green-500",
                      "text-xs h-6 w-14 rounded-md flex items-center justify-center text-white"
                    )}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {formatToRupiah(order.totalOrderAmount)}
                </p>
                <p className="text-xs text-gray-400">
                  {order.orderDetail.length} Product
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <OrderActions />
              <Link
                to={`/store/orders/${order.id}`}
                state={{ background: location }}
                className="btn-accent text-xs md:text-sm"
              >
                See detail
              </Link>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
