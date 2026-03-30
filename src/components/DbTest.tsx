import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { cityService } from '@/services/cityService';
import type { City } from '@/types';

/* ============================================
   Database Test Component - اختبار قاعدة البيانات
   للتحقق من الاتصال والتأكد من وجود الجداول
   ============================================ */

interface TestResult {
  table: string;
  status: 'success' | 'error';
  message: string;
  count?: number;
}

export function DbTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  const runTests = async () => {
    setIsLoading(true);
    const newResults: TestResult[] = [];

    try {
      // Test 1: Check profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      newResults.push({
        table: 'profiles',
        status: profilesError ? 'error' : 'success',
        message: profilesError ? profilesError.message : 'Connected',
        count: profiles?.length || 0,
      });

      // Test 2: Check vendors table
      const { data: vendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('id', { count: 'exact', head: true });
      
      newResults.push({
        table: 'vendors',
        status: vendorsError ? 'error' : 'success',
        message: vendorsError ? vendorsError.message : 'Connected',
        count: vendors?.length || 0,
      });

      // Test 3: Check products table
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });
      
      newResults.push({
        table: 'products',
        status: productsError ? 'error' : 'success',
        message: productsError ? productsError.message : 'Connected',
        count: products?.length || 0,
      });

      // Test 4: Check city_shipping table
      const { data: citiesData, error: citiesError } = await supabase
        .from('city_shipping')
        .select('*');
      
      newResults.push({
        table: 'city_shipping',
        status: citiesError ? 'error' : 'success',
        message: citiesError ? citiesError.message : 'Connected',
        count: citiesData?.length || 0,
      });

      // Get cities using service
      const fetchedCities = await cityService.getCities();
      setCities(fetchedCities);

    } catch (error) {
      console.error('Test error:', error);
    }

    setResults(newResults);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">اختبار قاعدة البيانات</h2>
      
      <button
        onClick={runTests}
        disabled={isLoading}
        className="btn btn-primary mb-6"
      >
        {isLoading ? 'جاري الاختبار...' : 'تشغيل الاختبار'}
      </button>

      <div className="space-y-3">
        {results.map((result) => (
          <div
            key={result.table}
            className={`p-4 rounded-lg border ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{result.table}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                result.status === 'success' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {result.status === 'success' ? '✓' : '✗'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            {result.count !== undefined && (
              <p className="text-sm text-gray-500">العدد: {result.count}</p>
            )}
          </div>
        ))}
      </div>

      {cities.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-3">المدن المتاحة ({cities.length})</h3>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {cities.map((city) => (
              <div key={city.id} className="text-sm p-2 bg-gray-50 rounded">
                <span className="font-medium">{city.nameAr}</span>
                <span className="text-gray-500"> - {city.shippingCost} MAD</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <p className="text-gray-500 text-center py-4">
          اضغط على الزر لتشغيل الاختبار
        </p>
      )}
    </div>
  );
}

export default DbTest;
