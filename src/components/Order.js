import moment from "moment";
import Currency from "react-currency-formatter";

const Order = (props) => {
  const { id, amount, amountShipping, items, timestamp, images } = props;

  return (
    <div className="relative border rounded-md">
      {/* TOP ORDER INFO GRAY SECTION */}
      <div className="flex items-center space-x-10 p-5 text-gray-600 bg-gray-100 text-sm">
        <div>
          <p className="font-bold text-xs">ORDER PLACED</p>
          <p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
        </div>

        <div>
          <p className="text-xs font-bold">TOTAL</p>
          <p>
            <Currency quantity={amount} currency="GBP" /> - Next Day Delivery{" "}
            <Currency quantity={amountShipping} currency="GBP" />
          </p>
        </div>

        <p className="text-sm self-end whitespace-nowrap sm:text-xl flex-1 text-right text-blue-500">
          {items.length} items
        </p>
        <p className="absolute top-2 right-2 w-40 truncate text-xs lg:w-72">
          ORDER # {id}
        </p>
      </div>
      {/* BOTTOM ORDER IMAGES SECTION */}
      <div className="p-5 sm:p-10 ">
        <div className="flex space-x-6 overflow-x-auto">
          {images.map((img) => {
            return (
              <img src={img} className="h-20 object-contain sm:h-32" alt="" />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Order;
