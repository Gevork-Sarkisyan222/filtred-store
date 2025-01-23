'use client';

import Card, { CardProps } from '@/components/card';
import FilterOptions, { CategoriesType } from '@/components/filter-options';
import Header from '@/components/header';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Filter, LoaderCircle, Search, X } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';

interface ProductsResponse {
  products: CardProps[];
}

interface FilterTypes {
  categories: string[];
  brands: string[];
  prices: number[];
}

export default function HomeTemplate() {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const limit = 300;

  const searchParams = useSearchParams();
  const isSmallDevice = useMediaQuery({ query: '(max-width: 1055px)' });
  const [filterOptions, setFilterOptions] = useState<FilterTypes>({
    categories: [],
    brands: [],
    prices: [0, 5000],
  });

  const [products, setProducts] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.has('search') ? searchParams.get('search') || '' : '',
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const fetchProducts = useCallback(
    debounce(async (query: string, currentPage?: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<ProductsResponse>(
          // `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${
          //   currentPage && currentPage * limit
          // }`,
          `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=0`,
        );
        // setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
        setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const checkedFilterOptions =
    filterOptions.categories.length > 0 ||
    filterOptions.brands.length > 0 ||
    filterOptions.prices[0] !== 0 ||
    filterOptions.prices[1] !== 5000;

  // for url useEffect hook
  useEffect(() => {
    const checkedFilterOptionsEffect =
      filterOptions.categories.length > 0 ||
      filterOptions.brands.length > 0 ||
      filterOptions.prices[0] !== 0 ||
      filterOptions.prices[1] !== 5000 ||
      searchValue !== '';

    if (checkedFilterOptionsEffect) {
      const queryObject: Record<string, any> = {
        categories: filterOptions.categories,
        brands: filterOptions.brands,
        prices: filterOptions.prices,
      };

      // Добавляем search только если оно не пустое
      if (searchValue.trim() !== '') {
        queryObject.search = searchValue;
      }

      const queryString = qs.stringify(queryObject, { arrayFormat: 'comma' });

      router.push(`/?${queryString}`, {
        scroll: false,
      });
    } else {
      router.push('/', {
        scroll: false,
      });
    }
  }, [filterOptions, searchValue, router]);

  console.log('location.search', window.location.search);
  console.log('filterOptions after', filterOptions);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value === '') {
      fetchProducts('');
    } else {
      fetchProducts(value);
    }
  };

  useEffect(() => {
    fetchProducts(searchParams.get('search') || '');
  }, [filterOptions, searchParams]);

  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const brandsCats = Array.from(new Set(products.map((product) => product.brand)));

  const onFilterChange = (filters: FilterTypes) => {
    setFilterOptions(filters);
    console.log('Updated filters:', filters);
  };

  const filteredProducts = products.filter((product) => {
    const inCategory =
      filterOptions.categories.length === 0 || filterOptions.categories.includes(product.category);
    const inBrand =
      filterOptions.brands.length === 0 || filterOptions.brands.includes(product.brand);
    const inPriceRange =
      product.price >= filterOptions.prices[0] && product.price <= filterOptions.prices[1];

    return inCategory && inBrand && inPriceRange;
  });

  // for fake loading
  // const [loadings, setLoadings] = useState<boolean[]>([]);

  // const enterLoading = (index: number) => {
  //   setLoadings((prevLoadings) => {
  //     const newLoadings = [...prevLoadings];
  //     newLoadings[index] = true;
  //     return newLoadings;
  //   });

  //   setTimeout(() => {
  //     setLoadings((prevLoadings) => {
  //       const newLoadings = [...prevLoadings];
  //       newLoadings[index] = false;
  //       return newLoadings;
  //     });
  //   }, 1000);
  // };

  return (
    <div>
      <Header />
      <div className="max-w-[1400px] m-auto my-[30px] px-[20px]">
        <div className="flex justify-center mb-[35px]">
          <div className="w-[500px] rounded-[13px] h-[60px] bg-[white] items-center px-[20px] text-[17px] shadow-md flex justify-between">
            <input
              value={searchValue}
              onChange={handleSearchChange}
              className="outline-none text-[#5f685b] font-[500] w-full"
              placeholder="Найдите продукт..."
              type="text"
            />

            {searchValue ? (
              <X
                className="icon cursor-pointer"
                onClick={() => {
                  setSearchValue('');
                  fetchProducts('');
                }}
                color="#90959f"
              />
            ) : (
              <Search className="icon cursor-pointer" color="#90959f" />
            )}
          </div>

          <div
            onClick={() => setIsFilterModalOpen(true)}
            className="w-[500px] rounded-[13px] h-[60px] bg-[white] items-center px-[20px] text-[17px] shadow-md hidden max-[1055px]:flex ml-[20px] justify-between cursor-pointer">
            <h1 className="font-[500] text-[#90959f]">Фильтры</h1>
            <Filter color={checkedFilterOptions ? '#0062FF' : '#90959f'} />
          </div>
        </div>

        <div className="flex gap-8 max-[1190px]:gap-[1rem]">
          <div className="w-[300px] max-[1055px]:hidden">
            <FilterOptions
              categories={categories}
              brandsCats={brandsCats}
              onFilterChange={onFilterChange}
            />
          </div>

          <div className="flex-1">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-6 max-[710px]:grid-cols-1">
                  {filteredProducts.map((product, index) => (
                    <Card key={`${product.id}-${index}`} {...product} />
                  ))}
                </div>

                {/* for load */}
                {/* <div className="flex justify-center mt-[20px]">
                  <Button
                    className="mt-4 py-2 h-[40px] w-[200px] text-[16px]"
                    type="primary"
                    loading={loadings[0]}
                    onClick={() => {
                      enterLoading(0);
                      setPage((prev) => prev + 1);
                    }}>
                    Загрузить еще
                  </Button>
                </div> */}
              </>
            ) : (
              <div className="flex justify-center items-center text-[25px] pt-[100px] text-center">
                <h1 className="text-[25px]">По вашему запросу ничего не найдено</h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal with smooth transition */}
      {isSmallDevice && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-500 ${
            isFilterModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsFilterModalOpen(false)}>
          <div
            className={`bg-white rounded-lg p-6 w-[90%] max-w-[500px] max-h-[90%] flex flex-col transition-all duration-500 transform ${
              isFilterModalOpen ? 'translate-y-0' : 'translate-y-[100%]'
            }`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Фильтры</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto mb-4">
              <FilterOptions
                inModal
                categories={categories}
                brandsCats={brandsCats}
                onFilterChange={onFilterChange}
              />
            </div>
            <div className="sticky bottom-0 left-0 w-full bg-white py-3 border-t border-gray-300 flex justify-center">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
