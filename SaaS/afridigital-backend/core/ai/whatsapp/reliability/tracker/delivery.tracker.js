/**
 * 📡 DELIVERY TRACKING SYSTEM
 * Tracks WhatsApp message lifecycle
 */

const deliveryMap = new Map();

function markStatus(messageId, status) {

  const record = deliveryMap.get(messageId) || {
    sent: false,
    delivered: false,
    read: false
  };

  record[status] = true;
  record.lastUpdate = Date.now();

  deliveryMap.set(messageId, record);

  return record;
}

function getStatus(messageId) {
  return deliveryMap.get(messageId);
}

module.exports = { markStatus, getStatus };
