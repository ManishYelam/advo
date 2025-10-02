const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
