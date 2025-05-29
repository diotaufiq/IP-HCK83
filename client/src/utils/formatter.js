const formatToRupiah = (amount) => {
  // Convert to number if it's a string
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(number)) {
    return 'Rp 0';
  }
  
  // Format the number with thousand separators
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
  
  // Return the formatted string
  return formattedNumber;
};

export { formatToRupiah };