
-- Replace the overly permissive insert policy with a more specific one
DROP POLICY "Anyone can create reservations" ON public.reservations;

-- Allow anonymous and authenticated users to insert, but restrict to reasonable data
CREATE POLICY "Public can create reservations"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND length(name) <= 200
    AND length(email) > 0 AND length(email) <= 255
    AND guest_count >= 1 AND guest_count <= 500
    AND status = 'pending'
  );
