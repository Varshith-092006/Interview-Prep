import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="glass rounded-3xl p-8">
      <Skeleton height={40} />

      <Skeleton
        count={4}
        className="mt-4"
      />
    </div>
  );
};

export default SkeletonCard;