import { useEffect } from "react";

export default function ShaTest() {
  useEffect(() => {
    const hashNumber = async () => {
      const value = "254112529019";

      const encoder = new TextEncoder();
      const data = encoder.encode(value);

      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);

      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("SHA256 hash:", hashHex);
    };

    hashNumber();
  }, []);

  return <div>Check console for SHA256 output</div>;
}
