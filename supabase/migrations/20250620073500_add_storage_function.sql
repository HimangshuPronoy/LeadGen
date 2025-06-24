
-- Function to add storage packages to existing subscription
CREATE OR REPLACE FUNCTION add_storage_packages(user_id_param UUID, additional_packages INTEGER)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.subscriptions 
  SET 
    max_storage_packages = max_storage_packages + additional_packages,
    updated_at = NOW()
  WHERE user_id = user_id_param AND status = 'active';
END;
$$;
