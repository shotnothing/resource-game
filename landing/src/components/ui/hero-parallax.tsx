import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);

  return (
    <div
      ref={null}
      className="h-[300vh] py-0 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] items-end justify-start"
    >
      <motion.div
        style={{
          rotateX: "15deg",
          rotateZ: "15deg",
          translateY: "-700px",
          translateX: "300px",
          opacity: 0.8,
        }}
        className="flex flex-col items-center justify-start gap-10"
      >
        <div className="flex flex-col space-y-10 w-full">
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: {
    title: string;
    thumbnail: string;
  };
}) => {
  return (
    <motion.div
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-[50rem] w-[80rem] relative flex-shrink-0 
        rounded-lg shadow-lg mx-auto"
    >
      <img
        src={product.thumbnail}
        className="object-cover object-left-top absolute h-full w-full inset-0 rounded-lg"
        alt={product.title}
      />
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black/50 transition-opacity duration-300 rounded-lg"></div>

    </motion.div>
  );
};
