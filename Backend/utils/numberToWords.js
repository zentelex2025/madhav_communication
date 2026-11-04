// Convert numbers to Indian Currency Words (e.g. 58700 -> "Rs. Fifty Eight Thousand Seven Hundred only")
const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(num) {
  let str = '';
  if (num >= 100) {
    str += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      str += ones[num] + ' ';
    } else {
      str += tens[Math.floor(num / 10)] + ' ';
      if (num % 10 > 0) {
        str += ones[num % 10] + ' ';
      }
    }
  }
  return str.trim();
}

export function numberToIndianWords(amount) {
  if (amount === 0 || !amount) return 'Rs. Zero only';

  const num = Math.round(Number(amount) * 100) / 100;
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let current = integerPart;
  let result = '';

  const crores = Math.floor(current / 10000000);
  current %= 10000000;

  const lakhs = Math.floor(current / 100000);
  current %= 100000;

  const thousands = Math.floor(current / 1000);
  current %= 1000;

  const remainder = current;

  if (crores > 0) {
    result += convertBelowThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertBelowThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertBelowThousand(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertBelowThousand(remainder) + ' ';
  }

  result = result.trim();
  let finalStr = `Rs. ${result}`;

  if (decimalPart > 0) {
    finalStr += ` and ${convertBelowThousand(decimalPart)} Paise`;
  }

  return `${finalStr} only`;
}
