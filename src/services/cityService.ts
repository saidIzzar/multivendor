import { supabase } from './supabase';
import { MOROCCAN_CITIES, type City } from '@/types';

/* ============================================
   City Service - خدمة المدن
   إدارة مدن الشحن والتوصيل
   ============================================ */

/* cityService - خدمة المدن */
export const cityService = {
  // الحصول على جميع المدن - Get All Cities
  getCities: async (): Promise<City[]> => {
    // أولاً محاولة جلب من قاعدة البيانات
    const { data } = await supabase
      .from('city_shipping')
      .select('*')
      .order('name');
    
    // إذا كانت هناك بيانات في قاعدة البيانات، استخدمها
    if (data && data.length > 0) {
      return data.map((city) => ({
        id: city.id,
        name: city.name,
        nameAr: city.name_ar,
        coordinates: city.coordinates,
        shippingCost: city.shipping_cost,
        createdAt: city.created_at,
      }));
    }
    
    // وإلا استخدم البيانات المحلية
    return MOROCCAN_CITIES;
  },

  // الحصول على مدينة واحدة - Get Single City
  getCity: async (cityName: string): Promise<City | null> => {
    const { data } = await supabase
      .from('city_shipping')
      .select('*')
      .eq('name', cityName)
      .single();
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        nameAr: data.name_ar,
        coordinates: data.coordinates,
        shippingCost: data.shipping_cost,
        createdAt: data.created_at,
      };
    }
    
    // استخدام البيانات المحلية كاحتياطي
    return MOROCCAN_CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    ) || null;
  },

  // الحصول على تكلفة الشحن لمدينة - Get Shipping Cost
  getShippingCost: async (cityName: string): Promise<number> => {
    const city = await cityService.getCity(cityName);
    return city?.shippingCost || 25; // الافتراضي 25 درهماً
  },

  // الحصول على إحداثيات المدينة - Get City Coordinates
  getCoordinates: async (cityName: string): Promise<{ lat: number; lng: number } | null> => {
    const city = await cityService.getCity(cityName);
    return city?.coordinates || null;
  },

  // التحقق من وجود جدول المدن - Check if Cities Table Exists
  checkTableExists: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('city_shipping')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  },

  // إنشاء جدول المدن (إذا لم يكن موجوداً) - Create Cities Table
  createTableIfNotExists: async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      // إدخال البيانات المحلية في قاعدة البيانات
      for (const city of MOROCCAN_CITIES) {
        const { error } = await supabase
          .from('city_shipping')
          .upsert({
            id: city.id,
            name: city.name,
            name_ar: city.nameAr,
            coordinates: city.coordinates,
            shipping_cost: city.shippingCost,
          }, { onConflict: 'id' });
        
        if (error) {
          return { success: false, error: error.message };
        }
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

export default cityService;
