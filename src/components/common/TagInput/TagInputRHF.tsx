import Tags from "@yaireo/tagify/dist/react.tagify"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css"; // Tagify CSS
import "./TagInput.css";
import { UseControllerProps, useController, FieldValues, FieldPath } from "react-hook-form";

const TagInputRHF = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: UseControllerProps<TFieldValues, TName>,
) => {
  const { field } = useController(props);

  return (
    <Tags
      {...field}
      // defaultValue={field.value}
      onChange={(e) => {
        const values = e.detail.tagify.value.map((item) => item.value);
        field.onChange(values);
      }}
    />
  );
};

export default TagInputRHF;
