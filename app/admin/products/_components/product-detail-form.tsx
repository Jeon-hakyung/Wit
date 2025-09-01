'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ProductDetail {
  id: string;
  key: string;
  value: string | number;
}

interface ProductDetailFormProps {
  details: ProductDetail[];
  onChange: (details: ProductDetail[]) => void;
  className?: string;
}

const ProductDetailForm = ({
  details,
  onChange,
  className,
}: ProductDetailFormProps) => {
  const addDetail = () => {
    const newDetails = [
      ...details,
      { id: `${Date.now()}-${Math.random()}`, key: '', value: '' },
    ];
    onChange(newDetails);
  };

  const removeDetail = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    onChange(newDetails);
  };

  const updateKey = (index: number, key: string) => {
    const newDetails = details.map((detail, i) =>
      i === index ? { ...detail, key } : detail,
    );
    onChange(newDetails);
  };

  const updateValue = (index: number, value: string | number) => {
    const newDetails = details.map((detail, i) =>
      i === index ? { ...detail, value } : detail,
    );
    onChange(newDetails);
  };

  const updateValueType = (index: number, type: 'string' | 'number') => {
    const currentValue = details[index].value;
    let newValue: string | number;

    if (type === 'number') {
      newValue = typeof currentValue === 'number' ? currentValue : 0;
    } else {
      newValue =
        typeof currentValue === 'string' ? currentValue : String(currentValue);
    }

    updateValue(index, newValue);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>상품 상세정보</CardTitle>
          <Button onClick={addDetail} size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            항목 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {details.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>상품의 상세 정보를 추가하세요.</p>
            <p className="mt-1 text-sm">예: 브랜드, 원산지, 재료, 크기 등</p>
          </div>
        ) : (
          <div className="space-y-3">
            {details.map((detail, index) => (
              <div
                key={detail.id}
                className="grid grid-cols-12 items-end gap-2"
              >
                <div className="col-span-4">
                  <Label htmlFor={`key-${index}`} className="text-xs">
                    항목명
                  </Label>
                  <Input
                    id={`key-${index}`}
                    value={detail.key}
                    onChange={e => updateKey(index, e.target.value)}
                    placeholder="예: 브랜드"
                    className="text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-xs">타입</Label>
                  <Select
                    value={
                      typeof detail.value === 'number' ? 'number' : 'string'
                    }
                    onValueChange={(value: 'string' | 'number') =>
                      updateValueType(index, value)
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">텍스트</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-5">
                  <Label htmlFor={`value-${index}`} className="text-xs">
                    값
                  </Label>
                  {typeof detail.value === 'number' ? (
                    <Input
                      id={`value-${index}`}
                      type="number"
                      value={detail.value}
                      onChange={e => updateValue(index, Number(e.target.value))}
                      placeholder="예: 100"
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      id={`value-${index}`}
                      type="text"
                      value={detail.value}
                      onChange={e => updateValue(index, e.target.value)}
                      placeholder="예: 삼성"
                      className="text-sm"
                    />
                  )}
                </div>

                <div className="col-span-1">
                  <Button
                    onClick={() => removeDetail(index)}
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {details.length > 0 && (
          <div className="text-xs text-muted-foreground">
            💡 상품 상세 페이지에서 이 정보들이 표시됩니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDetailForm;
