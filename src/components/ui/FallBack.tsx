export const FallBack = ({ message }: { message: string }) => {
  return (
    <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 text-center bg-neutral-800 text-red-400 rounded-lg p-2 z-50 md:p-4 shadow-lg">
      {message}
    </div>
  );
};
export default FallBack;