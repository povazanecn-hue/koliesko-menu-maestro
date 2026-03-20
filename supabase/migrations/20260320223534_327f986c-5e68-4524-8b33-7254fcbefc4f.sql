
-- Fix overly permissive order_items INSERT policy
DROP POLICY "Public can create order items" ON public.order_items;

CREATE POLICY "Public can create order items" ON public.order_items
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.status = 'pending')
    AND quantity >= 1 AND quantity <= 100
  );
