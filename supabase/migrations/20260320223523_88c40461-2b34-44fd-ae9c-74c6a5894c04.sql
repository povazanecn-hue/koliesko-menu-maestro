
-- =============================================
-- DAILY MENUS
-- =============================================
CREATE TABLE public.daily_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_date date NOT NULL,
  day_of_week text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(menu_date)
);

ALTER TABLE public.daily_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published daily menus" ON public.daily_menus
  FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Admins can view all daily menus" ON public.daily_menus
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert daily menus" ON public.daily_menus
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update daily menus" ON public.daily_menus
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete daily menus" ON public.daily_menus
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_daily_menus_updated_at
  BEFORE UPDATE ON public.daily_menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MENU ITEMS (daily menu items)
-- =============================================
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_menu_id uuid NOT NULL REFERENCES public.daily_menus(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'hlavne_jedlo',
  name text NOT NULL,
  description text,
  weight text,
  price numeric(8,2) NOT NULL DEFAULT 0,
  allergens text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  featured_on_home boolean NOT NULL DEFAULT false,
  visible_in_eshop boolean NOT NULL DEFAULT false,
  take_away boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view menu items of published menus" ON public.menu_items
  FOR SELECT TO public
  USING (EXISTS (SELECT 1 FROM public.daily_menus dm WHERE dm.id = daily_menu_id AND dm.is_published = true));

CREATE POLICY "Admins can view all menu items" ON public.menu_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert menu items" ON public.menu_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update menu items" ON public.menu_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete menu items" ON public.menu_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MENU CARD (permanent à la carte)
-- =============================================
CREATE TABLE public.menu_card (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(8,2) NOT NULL DEFAULT 0,
  weight text,
  allergens text[] DEFAULT '{}',
  photo_url text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_card ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible menu card items" ON public.menu_card
  FOR SELECT TO public USING (is_visible = true);

CREATE POLICY "Admins can do anything on menu card" ON public.menu_card
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_menu_card_updated_at
  BEFORE UPDATE ON public.menu_card
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ORDERS
-- =============================================
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE public.delivery_type AS ENUM ('pickup', 'delivery');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  delivery_type public.delivery_type NOT NULL DEFAULT 'pickup',
  delivery_address text,
  note text,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create orders" ON public.orders
  FOR INSERT TO public WITH CHECK (status = 'pending');

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(8,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create order items" ON public.order_items
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update order items" ON public.order_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete order items" ON public.order_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- GALLERY
-- =============================================
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  category text NOT NULL DEFAULT 'all',
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible gallery images" ON public.gallery
  FOR SELECT TO public USING (is_visible = true);

CREATE POLICY "Admins can do anything on gallery" ON public.gallery
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TESTIMONIALS
-- =============================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  source text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible testimonials" ON public.testimonials
  FOR SELECT TO public USING (is_visible = true);

CREATE POLICY "Admins can do anything on testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create contact messages" ON public.contact_messages
  FOR INSERT TO public
  WITH CHECK (length(name) > 0 AND length(name) <= 200 AND length(email) > 0 AND length(email) <= 255 AND length(message) > 0 AND length(message) <= 5000);

CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
