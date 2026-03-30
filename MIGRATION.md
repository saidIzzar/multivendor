# Supabase Database Migration Guide

## Prerequisites

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API

## Setup Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Option 1: Run SQL in Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute

The schema includes:
- Tables: `profiles`, `vendors`, `products`, `orders`, `reviews`, `coupons`, `notifications`, `city_shipping`
- Row Level Security (RLS) policies
- Auto-trigger for profile creation on signup
- Indexes for performance

## Option 2: Supabase CLI

### Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using Scoop (Windows)
scoop install supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase
```

### Initialize Supabase

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push schema to database
supabase db push

# Or reset database (drops all data)
supabase db reset
```

### Seed Data

```bash
supabase db push --db-url postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

Or run `supabase/seed.sql` in SQL Editor.

## Option 3: Programmatic Migration

If you want to run migrations from your app, you can use the Supabase client:

```typescript
import { supabase } from './services/supabase';

// Run schema creation (admin only)
async function runMigration() {
  // This requires a service role key with admin privileges
}
```

## Tables Created

### profiles
- `id` (UUID, PK) - References auth.users
- `email` (TEXT)
- `fullname` (TEXT)
- `phone` (TEXT, nullable)
- `role` (TEXT) - 'admin', 'vendor', 'customer'
- `avatar_url` (TEXT, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

### vendors
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `store_name` (TEXT)
- `store_description` (TEXT)
- `logo_url`, `banner_url` (TEXT)
- `is_approved` (BOOLEAN)
- Timestamps

### products
- `id` (UUID, PK)
- `vendor_id` (UUID, FK to vendors)
- `name`, `description` (TEXT)
- `price`, `original_price` (DECIMAL)
- `images` (TEXT[])
- `category` (TEXT)
- `stock` (INTEGER)
- `is_approved`, `is_featured` (BOOLEAN)
- `rating`, `review_count` (DECIMAL/INTEGER)
- Timestamps

### orders
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `items` (JSONB)
- `total_amount` (DECIMAL)
- `status` (TEXT) - pending, confirmed, processing, shipped, delivered, cancelled
- Shipping fields (JSONB for coordinates)
- Timestamps

### reviews
- `id` (UUID, PK)
- `product_id`, `user_id` (UUID, FK)
- `rating` (INTEGER 1-5)
- `comment` (TEXT)
- `created_at`

### coupons
- `id` (UUID, PK)
- `code` (TEXT, UNIQUE)
- `discount_type` (TEXT) - 'percentage' or 'fixed'
- `discount_value` (DECIMAL)
- `min_order_amount`, `max_uses` (DECIMAL/INTEGER, nullable)
- `valid_from`, `valid_until` (TIMESTAMP)
- `is_active` (BOOLEAN)

### notifications
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title`, `message` (TEXT)
- `type` (TEXT) - info, success, warning, error
- `is_read` (BOOLEAN)
- `created_at`

### city_shipping
- `id` (UUID, PK)
- `name`, `name_ar` (TEXT)
- `coordinates` (JSONB) - { lat, lng }
- `shipping_cost` (DECIMAL)

## Testing

After migration, verify:

1. **Create a user** via Supabase Auth
2. **Check profile created** automatically in `profiles` table
3. **Insert test data** in SQL Editor
4. **Test API** from your React app

## Troubleshooting

### RLS Issues
If you get permission errors, check RLS policies in SQL Editor:
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### OAuth Setup
After database is ready, enable OAuth providers:
1. Go to **Authentication → Providers**
2. Enable Google and/or GitHub
3. Add Client ID and Secret from your OAuth apps
