const Container = ({ className, children }) => {
  return (
    <>
      <div className={`max-w-7xl mx-auto ${className}`}>{children}</div>
    </>
  );
};

export default Container;
