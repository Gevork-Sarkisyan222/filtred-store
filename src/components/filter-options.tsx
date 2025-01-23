'use client';

import { ChevronUp } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox } from 'antd';
import { useSearchParams } from 'next/navigation';
import MultiRangeSlider from 'multi-range-slider-react';
import debounce from 'lodash.debounce';

interface ChangeResult {
  minValue: number;
  maxValue: number;
}

export interface CategoriesType {
  slug: string;
  name: string;
  url: string;
}

type Props = {
  categories: CategoriesType[];
  brandsCats: string[];
  onFilterChange: (filters: { categories: string[]; brands: string[]; prices: number[] }) => void;
  inModal?: boolean;
};

function FilterOptions({ categories, brandsCats, onFilterChange, inModal }: Props) {
  const searchParams = useSearchParams();

  const [openTypeOfEmployment, setOpenTypeOfEmployment] = useState(true);
  const [openSeniorityLevel, setOpenSeniorityLevel] = useState(true);
  const [openRangeSlider, setOpenRangeSlider] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.has('categories') ? (searchParams.get('categories') || '').split(',') : [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.has('brands') ? (searchParams.get('brands') || '').split(',') : [],
  );
  const [selectedPrices, setSelectedPrices] = useState<number[]>(
    searchParams.get('prices') ? searchParams.get('prices')!.split(',').map(Number) : [0, 5000],
  );

  const [debouncedPrices, setDebouncedPrices] = useState<number[]>([0, 5000]);

  // Debounced price update using lodash
  const debouncedUpdatePrices = useMemo(
    () =>
      debounce((prices: number[]) => {
        setDebouncedPrices(prices);
      }, 550),
    [],
  );

  const handleCategoryChange = useCallback((category: string, isChecked: boolean) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (isChecked) {
        return [...prevSelectedCategories, category];
      } else {
        return prevSelectedCategories.filter((cat) => cat !== category);
      }
    });
  }, []);

  const handleBrandChange = useCallback((brand: string, isChecked: boolean) => {
    setSelectedBrands((prevSelectedBrands) => {
      if (isChecked) {
        return [...prevSelectedBrands, brand];
      } else {
        return prevSelectedBrands.filter((b) => b !== brand);
      }
    });
  }, []);

  const handlePriceChange = useCallback(
    (e: ChangeResult) => {
      const prices = [e.minValue, e.maxValue];
      setSelectedPrices(prices);
      debouncedUpdatePrices(prices); // Update debounced prices
    },
    [debouncedUpdatePrices],
  );

  // Trigger filter change when filters are updated
  useEffect(() => {
    if (selectedCategories.length > 0 || selectedBrands.length > 0 || debouncedPrices.length > 0) {
      onFilterChange({
        categories: selectedCategories,
        brands: selectedBrands,
        prices: debouncedPrices,
      });
    }
  }, [selectedCategories, selectedBrands, debouncedPrices]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdatePrices.cancel();
    };
  }, [debouncedUpdatePrices]);

  return (
    <div
      className={`mt-[50px] max-w-[266px] ${inModal ? 'max-w-full' : ''}`}
      style={{ userSelect: 'none' }}>
      {/* Categories Section */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[19px]">Категории</h2>
        <ChevronUp
          onClick={() => setOpenTypeOfEmployment(!openTypeOfEmployment)}
          className={`cursor-pointer transition-transform duration-300 ${
            openTypeOfEmployment ? '' : 'rotate-180'
          }`}
        />
      </div>
      <div
        className={`transition-max-height duration-500 overflow-hidden ${
          openTypeOfEmployment ? 'max-h-[max]' : 'max-h-0'
        }`}>
        <div className="flex flex-col mt-[15px] gap-[10px]" style={{ userSelect: 'none' }}>
          {categories.map((category) => (
            <Checkbox
              checked={selectedCategories.includes(category.slug)}
              key={category.slug}
              onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}>
              <span className="text-[17px]">{category.name}</span>
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="flex items-center mt-[50px] justify-between">
        <h2 className="font-bold text-[19px]">Бренд</h2>
        <ChevronUp
          onClick={() => setOpenSeniorityLevel(!openSeniorityLevel)}
          className={`cursor-pointer transition-transform duration-300 ${
            openSeniorityLevel ? '' : 'rotate-180'
          }`}
        />
      </div>
      <div
        className={`transition-max-height duration-500 overflow-hidden ${
          openSeniorityLevel ? 'max-h-[max]' : 'max-h-0'
        }`}>
        <div className="flex flex-col mt-[15px] gap-[10px]">
          {brandsCats.map((brand, index) => (
            <Checkbox
              checked={selectedBrands.includes(brand)}
              key={`${brand}-${index}`}
              onChange={(e) => handleBrandChange(brand, e.target.checked)}>
              <span className="text-[17px]">{brand}</span>
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="flex items-center mt-[50px] justify-between">
        <h2 className="font-bold text-[19px]">Цена по диапазону</h2>
        <ChevronUp
          onClick={() => setOpenRangeSlider(!openRangeSlider)}
          className={`cursor-pointer transition-transform duration-300 ${
            openRangeSlider ? '' : 'rotate-180'
          }`}
        />
      </div>
      {openRangeSlider && (
        <div className="mt-[20px]">
          <MultiRangeSlider
            min={0}
            max={5000}
            step={5}
            minValue={selectedPrices[0]}
            maxValue={selectedPrices[1]}
            onInput={handlePriceChange}
          />

          <div className="flex pt-[30px] max-[1055px]:pt-[0px] gap-[10px] justify-between items-center max-[1055px]:mt-[20px]">
            <div>
              <b className="text-[16px] mr-[15px]">Min</b>
              <input
                readOnly
                value={selectedPrices[0]}
                type="number"
                onChange={(e) => {
                  const newMinValue = Math.min(Number(e.target.value), selectedPrices[1]);
                  handlePriceChange({
                    minValue: newMinValue,
                    maxValue: selectedPrices[1],
                  });
                }}
                className="w-[109px] h-[42px] border-[1px] border-[#D1D1D1] rounded-[12px] px-[10px] text-[14px] outline-none appearance-none"
                placeholder="Min"
                min={0}
                max={selectedPrices[1]}
              />
            </div>

            <div>
              <b className="text-[16px] mr-[15px]">Max</b>
              <input
                readOnly
                value={selectedPrices[1]}
                type="number"
                onChange={(e) => {
                  const newMaxValue = Math.max(Number(e.target.value), selectedPrices[0]);
                  handlePriceChange({
                    minValue: selectedPrices[0],
                    maxValue: newMaxValue,
                  });
                }}
                className="w-[109px] h-[42px] border-[1px] border-[#D1D1D1] rounded-[12px] px-[10px] text-[14px] outline-none appearance-none"
                placeholder="Max"
                min={selectedPrices[0]}
                max={5000}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterOptions;
