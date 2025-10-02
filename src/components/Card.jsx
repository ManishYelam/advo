const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded p-4 ${className}`}>
      {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
