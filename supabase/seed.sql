-- ============================================
-- MultiVendors Seed Data
-- ============================================

-- Insert Moroccan Cities
INSERT INTO public.city_shipping (name, name_ar, coordinates, shipping_cost) VALUES
('Casablanca', 'الدار البيضاء', '{"lat": 33.5731, "lng": -7.5898}', 25),
('Rabat', 'الرباط', '{"lat": 34.0209, "lng": -6.8416}', 20),
('Marrakech', 'مراكش', '{"lat": 31.6295, "lng": -7.9811}', 30),
('Fes', 'فاس', '{"lat": 34.0181, "lng": -5.0078}', 35),
('Tangier', 'طنجة', '{"lat": 35.7595, "lng": -5.8340}', 30),
('Agadir', 'أكادير', '{"lat": 30.4278, "lng": -9.5982}', 40),
('Meknes', 'مكناس', '{"lat": 33.8938, "lng": -5.5473}', 35),
('Oujda', 'وجدة', '{"lat": 34.6818, "lng": -1.9075}', 45),
('Kenitra', 'القنيطرة', '{"lat": 34.2551, "lng": -6.5892}', 25),
('Tetouan', 'تطوان', '{"lat": 35.5889, "lng": -5.3626}', 35),
('Sale', 'سلا', '{"lat": 34.0535, "lng": -6.7980}', 20),
('Beni Mellal', 'بيني ملال', '{"lat": 32.3370, "lng": -6.3493}', 40),
('Azrou', 'أزرو', '{"lat": 33.4569, "lng": -5.2193}', 35),
('El Jadida', 'الجديدة', '{"lat": 33.2316, "lng": -8.5007}', 35),
('Essaouira', 'الصويرة', '{"lat": 31.5085, "lng": -9.7595}', 45),
('Ouarzazate', 'ورزازات', '{"lat": 30.9335, "lng": -6.9370}', 55),
('Chefchaouen', 'شفشاون', '{"lat": 35.1688, "lng": -5.2636}', 45),
('Ifrane', 'إفران', '{"lat": 33.5294, "lng": -5.1113}', 40),
('Nador', 'الناظور', '{"lat": 35.1680, "lng": -2.9285}', 50),
('Dakhla', 'الداخلة', '{"lat": 23.6848, "lng": -15.9578}', 80)
ON CONFLICT DO NOTHING;

-- Insert Sample Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, valid_until, is_active) VALUES
('WELCOME10', 'percentage', 10, 200, '2026-12-31', true),
('SUMMER20', 'percentage', 20, 500, '2026-06-30', true),
('FREE50', 'fixed', 50, 300, '2026-12-31', true)
ON CONFLICT (code) DO NOTHING;
