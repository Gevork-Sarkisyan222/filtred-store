import React, { useCallback, useEffect, useState, useRef } from 'react';
import './multiRangeSlider.css';

interface MultiRangeSliderProps {
  min: number;
  max: number;
  handlePriceChange: (min: number, max: number) => void; // Callback to handle price changes
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({ min, max, handlePriceChange }) => {
  const [minVal, setMinVal] = useState<number>(min); // Initialize with `min`
  const [maxVal, setMaxVal] = useState<number>(max); // Initialize with `max`

  const range = useRef<HTMLDivElement | null>(null);

  const getPercent = useCallback(
    (value: number): number => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Update the range track styles
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Notify parent of price changes
  useEffect(() => {
    handlePriceChange(minVal, maxVal);
  }, [minVal, maxVal, handlePriceChange]);

  return (
    <div className="w-full">
      {/* Sliders */}
      <div className="max-[1055px]:hidden">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
        </div>
      </div>
      {/* Input fields */}
      <div className="flex pt-[30px] max-[1055px]:pt-[0px] gap-[10px] justify-between items-center">
        <div>
          <b className="text-[16px] mr-[15px]">Min</b>
          <input
            value={minVal}
            type="number"
            onChange={(event) => {
              const value = Math.min(Number(event.target.value), maxVal - 1);
              setMinVal(value);
            }}
            className="w-[109px] h-[42px] border-[1px] border-[#D1D1D1] rounded-[12px] px-[10px] text-[14px] outline-none appearance-none"
            placeholder="Min"
            max={maxVal - 1}
          />
        </div>

        <div>
          <b className="text-[16px] mr-[15px]">Max</b>
          <input
            value={maxVal}
            type="number"
            onChange={(event) => {
              const value = Math.min(Math.max(Number(event.target.value), minVal + 1), max);
              setMaxVal(value);
            }}
            className="w-[109px] h-[42px] border-[1px] border-[#D1D1D1] rounded-[12px] px-[10px] text-[14px] outline-none appearance-none"
            placeholder="Max"
            min={minVal + 1}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
