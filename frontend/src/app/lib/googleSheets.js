const SHEETS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Submits booking + passport data to Google Sheets via Apps Script web app.
 * Passport images are sent as base64 and stored in Google Drive by the script.
 */
export async function submitBookingToSheets({
  from,
  to,
  date,
  time,
  passengers,
  vehicle,
  flightNumber,
  childSeat,
  driverNotes,
  firstName,
  lastName,
  email,
  phone,
  passportFullName,
  passportNumber,
  nationality,
  dateOfBirth,
  passportExpiry,
  passportFrontFile,
  passportBackFile,
}) {
  if (!SHEETS_WEBHOOK_URL) {
    throw new Error("Google Sheets webhook URL is not configured");
  }

  let passportFrontB64 = null;
  let passportFrontName = null;
  let passportBackB64 = null;
  let passportBackName = null;

  if (passportFrontFile) {
    passportFrontB64 = await fileToBase64(passportFrontFile);
    passportFrontName = passportFrontFile.name;
  }
  if (passportBackFile) {
    passportBackB64 = await fileToBase64(passportBackFile);
    passportBackName = passportBackFile.name;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    from,
    to,
    date,
    time,
    passengers,
    vehicle,
    flightNumber: flightNumber || "",
    childSeat: childSeat === "1" ? "Yes" : "No",
    driverNotes: driverNotes || "",
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    phone: phone || "",
    passportFullName,
    passportNumber,
    nationality,
    dateOfBirth,
    passportExpiry,
    passportFrontFileName: passportFrontName,
    passportFrontBase64: passportFrontB64,
    passportBackFileName: passportBackName,
    passportBackBase64: passportBackB64,
  };

  const res = await fetch(SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
    mode: "no-cors",
  });

  return { ok: true };
}
