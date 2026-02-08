// admin-panel/src/utils/formatters.js

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0₮';
  return `${amount.toLocaleString('mn-MN')}₮`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('mn-MN');
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
};

export const getLoanStatusText = (status) => {
  const statusMap = {
    pending_verification: 'Баталгаажуулалт хүлээгдэж байна',
    under_review: 'Шалгаж байна',
    approved: 'Зөвшөөрөгдсөн',
    pending_disbursement: 'Зээл олгох хүлээгдэж байна',

    disbursed: 'Олгогдсон',
    active: 'Идэвхтэй',
    paid: 'Төлөгдсөн',
    overdue: 'Хугацаа хэтэрсэн',
    cancelled: 'Цуцлагдсан',
  };
  return statusMap[status] || status;
};

export const getLoanStatusColor = (status) => {
  const colorMap = {
    pending_verification: '#FFC107',
    under_review: '#FFC107',
    approved: '#4CAF50',
    pending_disbursement: '#2196F3', // ✅ ШИНЭ: Цэнхэр

    disbursed: '#4CAF50',
    active: '#E53935',
    paid: '#4CAF50',
    overdue: '#FF5252',
    cancelled: '#9E9E9E',
  };
  return colorMap[status] || '#9E9E9E';
};