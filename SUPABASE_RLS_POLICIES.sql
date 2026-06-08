-- Supabase Row Level Security (RLS) Policies

-- ==========================================
-- 0. STORAGE BUCKET: Prescriptions
-- ==========================================

-- Create the bucket for medical records (prescriptions)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical_records', 'medical_records', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to insert/upload files to this bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medical_records');

-- Allow users to read their own uploaded files
CREATE POLICY "Allow users to read their own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'medical_records' AND auth.uid()::text = (string_to_array(name, '_'))[1]);

-- Allow admins to read all files in this bucket
CREATE POLICY "Allow admins to read all medical records" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'medical_records' AND auth.jwt() ->> 'email' = 'admin@bendaryph.com');

-- ==========================================
-- 1. Enable RLS on the "products" table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to SELECT (read) products
CREATE POLICY "Allow public read access for products" 
ON products FOR SELECT USING (true);

-- 3. Allow only authenticated admin users to INSERT, UPDATE, or DELETE products
-- Assuming you have a way to identify admins (like a role in user_metadata or a separate admin table)
CREATE POLICY "Allow admins full access to products"
ON products FOR ALL USING (
  auth.uid() IN (SELECT id FROM admins) -- Example if you have an admins table
  -- OR: auth.jwt() ->> 'email' = 'admin@bendaryph.com' 
);

-- 4. Enable RLS on the "orders" table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. Allow users to see only their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

-- 6. Allow users to insert their own orders
CREATE POLICY "Users can create their own orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Allow admins to see all orders
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins) 
  -- OR a specific email
);
