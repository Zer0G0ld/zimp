// frontend/src/services/api.ts
export async function fetchDevices() {
    const res = await fetch("http://localhost:6201/devices");
    return res.json();
}
