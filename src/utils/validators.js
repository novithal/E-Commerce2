
export function validateProduct(values) {
  const errors = {};

  if (!values.name?.trim()) errors.name = "Product name is required.";
  if (!values.sku?.trim()) errors.sku = "SKU is required.";
  if (!values.category?.trim()) errors.category = "Choose a category.";

  if (values.price === "" || !Number.isFinite(Number(values.price)) || Number(values.price) < 0) {
    errors.price = "Enter a valid price (0 or more).";
  }

  if (values.stock === "" || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) {
    errors.stock = "Stock must be a whole number (0 or more).";
  }

  return errors;
}

export function validateProfile(values) {
  const errors = {};

  if (!values.name?.trim()) errors.name = "Name is required.";

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone?.trim()) errors.phone = "Phone number is required.";

  return errors;
}
