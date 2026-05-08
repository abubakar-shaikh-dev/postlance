const TEXTBEE_BASE = 'https://api.textbee.dev/api/v1';
const API_KEY = process.env.TEXT_BEE_API_KEY;
const DEVICE_ID = process.env.TEXT_BEE_DEVICE_ID;

// Log config status once at module load
if (API_KEY && DEVICE_ID) {
  console.log('[SMS] TextBee configured — device:', DEVICE_ID);
} else {
  console.warn('[SMS] TextBee not configured — missing TEXT_BEE_API_KEY or TEXT_BEE_DEVICE_ID');
}

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

  const url = `${TEXTBEE_BASE}/gateway/devices/${DEVICE_ID}/send-sms`;
  const body = { recipients: [to], message };

  console.log(`[SMS] Sending to ${to}: "${message}"`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();

    if (!res.ok) {
      console.error(`[SMS] TextBee error ${res.status}: ${responseText}`);
      return false;
    }

    console.log(`[SMS] Sent to ${to} — response: ${responseText}`);
    return true;
  } catch (err) {
    console.error(`[SMS] Network error sending to ${to}:`, err.message);
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

export async function notifyWithdrawalConfirmed(studentPhone, studentName, amount) {
  return sendSMS(
    studentPhone,
    `${studentName}, withdrawal of Rs.${amount.toLocaleString()} confirmed. Your PostLance wallet has been debited.`
  );
}

export async function notifyProjectStatusChanged(studentPhone, studentName, projectTitle, newStatus) {
  return sendSMS(
    studentPhone,
    `${studentName}, your project "${projectTitle}" is now ${newStatus}. Check your PostLance dashboard.`
  );
}

export async function notifyInvitationResponded(clientPhone, clientName, studentName, status) {
  const action = status === 'accepted' ? 'accepted' : 'declined';
  return sendSMS(
    clientPhone,
    `${clientName}, ${studentName} has ${action} your invitation. Check your PostLance dashboard.`
  );
}
