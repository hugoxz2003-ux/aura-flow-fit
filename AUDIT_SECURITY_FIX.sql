-- ========================================================
-- AURA FLOW FIT - SECURITY & AUDIT FIX (RLS)
-- ========================================================
-- This script hardens the database by enabling Row Level Security.
-- Execute this in the Supabase SQL Editor.

-- 1. ENABLE RLS ON ALL TABLES
ALTER TABLE public.socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES FOR 'SOCIOS' (MEMBERS)
-- Admin can do everything
CREATE POLICY "Admins have full access to socios" 
ON public.socios FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'superadmin');

-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.socios FOR SELECT 
TO authenticated 
USING (auth.email() = email);

-- Users can update their own body metrics (optional but useful)
CREATE POLICY "Users can update own body metrics" 
ON public.socios FOR UPDATE 
TO authenticated 
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- 3. POLICIES FOR 'CLASES' (CLASSES)
-- Everyone can view classes
CREATE POLICY "Anyone can view classes" 
ON public.clases FOR SELECT 
TO public 
USING (true);

-- Only admins can manage classes
CREATE POLICY "Admins can manage classes" 
ON public.clases FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'superadmin');

-- 4. POLICIES FOR 'RESERVAS' (BOOKINGS)
-- Admins full access
CREATE POLICY "Admins have full access to reservas" 
ON public.reservas FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'superadmin');

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" 
ON public.reservas FOR SELECT 
TO authenticated 
USING (socio_id IN (SELECT id FROM public.socios WHERE email = auth.email()));

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings" 
ON public.reservas FOR INSERT 
TO authenticated 
WITH CHECK (socio_id IN (SELECT id FROM public.socios WHERE email = auth.email()));

-- Users can cancel their own bookings
CREATE POLICY "Users can delete own bookings" 
ON public.reservas FOR DELETE 
TO authenticated 
USING (socio_id IN (SELECT id FROM public.socios WHERE email = auth.email()));

-- 5. POLICIES FOR 'MEMBERSHIP_PLANS'
CREATE POLICY "Anyone can view plans" ON public.membership_plans FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage plans" ON public.membership_plans FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- 6. POLICIES FOR 'TRANSACTIONS'
CREATE POLICY "Admins view all transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT TO authenticated USING (socio_id IN (SELECT id FROM public.socios WHERE email = auth.email()));

-- 7. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
