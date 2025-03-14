import { filterControl } from "@/config";
import FormInput from "@/components/form/FormInput";

// eslint-disable-next-line react/prop-types
const ProductsFilter = ({ searchForm }) => {
  return (
    <div className="h-full border rounded-lg py-4 px-3">
      <div className="space-y-4">
        <h4>Filter Product</h4>
        <FormInput formik={searchForm} formControl={filterControl} />
      </div>
    </div>
  );
};

export default ProductsFilter;
