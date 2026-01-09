export async function sendToBluetoothPrinter(data: Uint8Array) {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [0xFFE0],
  });

  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(0xFFE0);
  const characteristic = await service.getCharacteristic(0xFFE1);

  await characteristic.writeValue(data);
}
