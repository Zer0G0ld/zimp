// frontend/src/services/api.ts
export async function fetchDevices() {
    try {
        const res = await fetch("http://localhost:7501/devices");
        if (!res.ok) {
            throw new Error(`Erro na API: ${res.status}`);
        }
        return res.json();
    } catch (error) {
        console.error("Falha ao buscar dispositivos:", error);
        return [];
    }
}
