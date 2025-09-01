const EmptyList = () => {
  return (
    <div className="relative flex h-[calc(100vh-135px)] flex-col items-center justify-center p-4">
      <p className="absolute left-4 top-4 text-xs font-normal leading-[1.33] text-[#6B6B6B]">
        기념품 0개
      </p>
      <div className="flex flex-col items-center">
        <div className="text-center">
          <p className="text-sm font-medium leading-[1.57] text-[#9D9D9D]">
            위시리스트가 아직 비어 있어요.
            <br />
            기념품을 담아보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyList;
