export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {' '}
      <h2 className="text-4xl animate-pulse text-primary"> Loading...</h2>
    </div>
  );
}
