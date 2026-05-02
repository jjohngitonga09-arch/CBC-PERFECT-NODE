export function detectDeviceProfile() {
 const memory = navigator.deviceMemory || 4 // GB
 const connection = navigator.connection?.effectiveType || '4g'
 const width = window.innerWidth

 const isLite = memory <= 2 || connection === '2g' || connection === 'slow-2g'

 return {
 memory,
 connection,
 width,
 variant: isLite ? 'lite' : 'full',
 isLite,
 }
}
