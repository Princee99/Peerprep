const InputField = ({ label, type, name, value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
export default InputField;
