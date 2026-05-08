const TEXTBEE_BASE = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXT_BEE_API_KEY;
const DEVICE_ID = process.env.TEXT_BEE_DEVICE_ID;

function formatPhone(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

/**
 * Send an SMS via TextBee. Fails silently — never throws.
 * @param {string} phone - E.164 phone number (e.g. +919876543210)
 * @param {string} message - SMS body
 * @returns {Promise<boolean>} true if sent, false if skipped/failed
 */
export async function sendSMS(phone, message) {
  if (!API_KEY || !DEVICE_ID) {
    console.warn('[SMS] TextBee not configured. Skipping message.');
    return false;
  }

  const to = formatPhone(phone);
  if (!to) {
    console.warn('[SMS] No phone number provided. Skipping message.');
    return false;
  }

  try {
    const res = await fetch(
      `${TEXTBEE_BASE}/gateway/devices/${DEVICE_ID}/send-sms`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          recipients: [to],
          message,
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[SMS] TextBee API error (${res.status}): ${errBody}`);
      return false;
    }

    const data = await res.json();
    console.log(`[SMS] Message sent to ${to}:`, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`[SMS] Failed to send to ${to}:`, err.message);
    return false;
  }
}

// ─── Notification templates ───

export async function notifyProposalAccepted(studentPhone, studentName, projectTitle) {
  return sendSMS(
    studentPhone,
    `Congrats ${studentName}! Your proposal for "${projectTitle}" was accepted. Check your PostLance dashboard.`
  );
}

export async function notifyProposalDeclined(studentPhone, studentName, projectTitle) {
  return sendSMS(
    studentPhone,
    `Hi ${studentName}, your proposal for "${projectTitle}" was declined. Browse more projects on PostLance!`
  );
}

export async function notifyPaymentReceived(studentPhone, studentName, amount, projectTitle) {
  return sendSMS(
    studentPhone,
    `Payment received! ${studentName}, you got paid Rs.${amount.toLocaleString()} for "${projectTitle}". Check your PostLance wallet.`
  );
}

export async function notifyInvitationReceived(studentPhone, studentName, clientName, projectTitle) {
  return sendSMS(
    studentPhone,
    `${studentName}, ${clientName} invited you to apply for "${projectTitle}". Check your PostLance invitations.`
  );
}

export async function notifyNewProposal(clientPhone, clientName, projectTitle) {
  return sendSMS(
    clientPhone,
    `${clientName}, you received a new proposal for "${projectTitle}". Review it on your PostLance dashboard.`
  );
}

export async function notifyWalletToppedUp(clientPhone, clientName, amount) {
  return sendSMS(
    clientPhone,
    `Wallet topped up! Rs.${amount.toLocaleString()} added to your PostLance wallet.`
  );
}
