import Image from "next/image";
import { StarIcon } from "@heroicons/react/solid";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";

const CheckoutProduct = (props) => {
  const { id, title, price, description, category, image, rating, hasPrime } =
    props;

  const dispatch = useDispatch();
  const addItemToBasket = () => {
    dispatch(addToBasket(props));
  };
  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />
      <div className="col-span-3  mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => {
              return <StarIcon className="h-5 text-yellow-500" key={i} />;
            })}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <Currency quantity={price} currency="GBP" />
        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              loading="lazy"
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 justify-self-end my-auto">
        <button className="button" onClick={addItemToBasket}>
          Add to Basket
        </button>
        <button className="button" onClick={() => removeItemFromBasket(id)}>
          Remove from Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
