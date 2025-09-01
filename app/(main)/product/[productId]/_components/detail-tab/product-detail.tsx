interface ProductDetailInfoTableProps {
  details: { key: string; value: string }[];
}

const ProductDetailInfoTable = ({ details }: ProductDetailInfoTableProps) => {
  if (!details || details.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-wit-gray-300">
        상품 상세 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 text-sm">
      <div className="space-y-2.5 font-medium text-[#6B6B6B]">
        {details.map(detail => (
          <div key={detail.key}>{detail.key}</div>
        ))}
      </div>
      <div className="space-y-2.5 text-[#282828]">
        {details.map(detail => (
          <div key={detail.key} className="leading-relaxed">
            {detail.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailInfoTable;
