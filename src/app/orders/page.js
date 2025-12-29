import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/order";

export default async function OrdersPage() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-3 text-sm">
                    {order._id.toString().slice(-6)}
                  </td>
                  <td className="p-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-medium">₹{order.totalAmount}</td>
                  <td className="p-3 capitalize">{order.status}</td>
                  <td className="p-3 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
