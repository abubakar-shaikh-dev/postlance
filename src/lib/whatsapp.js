import twilio from 'twilio';

const TWILIO_SID = process.env.TWILLIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILLIO_AUTH_TOKEN;
const WHATSAPP_FROM = 'whatsapp:+14155238886'; // Twilio WhatsApp sandbox number

let client = null;
function getClient() {
  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) return null;
  if (!client) {
    client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
  }
  return client;
}

function formatPhone(phone) {
  if (!phone) return null;
  // Strip spaces/dashes, ensure it starts with +
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

/**
 * Send a WhatsApp message. Fails silently — never throws.
 * @param {string} phone - E.164 phone number (e.g. +919876543210)
 * @param {string} body - Message body
 * @returns {Promise<boolean>} true if sent, false if skipped/failed
 */
export async function sendWhatsApp(phone, body) {
  const twilioClient = getClient();
  if (!twilioClient) {
    console.warn('[WhatsApp] Twilio not configured. Skipping message.');
    return false;
  }

  const to = formatPhone(phone);
  if (!to) {
    console.warn('[WhatsApp] No phone number provided. Skipping message.');
    return false;
  }

  try {
    await twilioClient.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body,
    });
    console.log(`[WhatsApp] Message sent to ${to}`);
    return true;
  } catch (err) {
    // Sandbox: unopted numbers get error 63003. Log but don't crash.
    console.error(`[WhatsApp] Failed to send to ${to}:`, err.message);
    return false;
  }
}

// ─── Pre-built notification templates ───

export async function notifyProposalAccepted(studentPhone, studentName, projectTitle) {
  return sendWhatsApp(
    studentPhone,
    `🎉 Congratulations ${studentName}! Your proposal for "${projectTitle}" was accepted. Head to your dashboard to get started!`
  );
}

export async function notifyProposalDeclined(studentPhone, studentName, projectTitle) {
  return sendWhatsApp(
    studentPhone,
    `Hi ${studentName}, your proposal for "${projectTitle}" was declined. Don't give up — browse more projects on PostLance!`
  );
}

export async function notifyPaymentReceived(studentPhone, studentName, amount, projectTitle) {
  return sendWhatsApp(
    studentPhone,
    `💰 Payment received! ${studentName}, you just got paid ₹${amount.toLocaleString()} for "${projectTitle}". Check your wallet!`
  );
}

export async function notifyInvitationReceived(studentPhone, studentName, clientName, projectTitle) {
  return sendWhatsApp(
    studentPhone,
    `📨 ${studentName}, ${clientName} has invited you to apply for "${projectTitle}". Check your invitations on PostLance!`
  );
}

export async function notifyNewProposal(clientPhone, clientName, projectTitle) {
  return sendWhatsApp(
    clientPhone,
    `📋 ${clientName}, you received a new proposal for "${projectTitle}". Review it on your dashboard!`
  );
}

export async function notifyWalletToppedUp(clientPhone, clientName, amount) {
  return sendWhatsApp(
    clientPhone,
    `✅ Wallet topped up! ₹${amount.toLocaleString()} has been added to your PostLance wallet.`
  );
}
