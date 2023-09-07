import Navbar from './Navbar';

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <footer></footer>
    </>
  );
};

export default layout;
