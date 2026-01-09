import { buildReceipt } from "../system/ReceiptBuilder";
import { sendToBluetoothPrinter } from "../system/BlueToothPrinter";
import { getAuth } from "firebase/auth";

export async function printReceipt(transId: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const idToken = await user.getIdToken();
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/payments/${transId}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  const bytes = buildReceipt(data.payment);
  await sendToBluetoothPrinter(bytes);
}
