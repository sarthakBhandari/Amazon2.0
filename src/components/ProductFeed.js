import Product from "./Product";

const ProductFeed = ({ products }) => {
  return (
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-atuo">
      {products.slice(0, 4).map((item) => {
        return <Product key={item.id} {...item} />;
      })}
      <img
        className=" md:col-span-full"
        src="https://links.papareact.com/dyz"
        alt=""
      />
      <div className="md:col-span-2">
        {products.slice(4, 5).map((item) => {
          return <Product key={item.id} {...item} />;
        })}
      </div>
      {products.slice(5, products.length).map((item) => {
        return <Product key={item.id} {...item} />;
      })}
    </div>
  );
};

export default ProductFeed;
