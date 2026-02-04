import { ClipLoader } from 'react-spinners';

const Loading = ({
  loading = true,
  size = 50,
  color = '#16a34a', // green default
}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader loading={loading} size={size} color={color} aria-label="Loading Spinner" />
    </div>
  );
};

export default Loading;
