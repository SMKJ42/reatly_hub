import ReactQuill from "react-quill";

export function ReactQuil(props: {
  theme: string;
  value: string;
  onChange: (string: string) => void;
}) {
  const { theme, value, onChange } = props;
  return <ReactQuill theme={theme} value={value} onChange={onChange} />;
}
