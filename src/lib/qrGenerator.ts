import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(studentId: string): Promise<string> {
  const url = `https://siraq.in/verify/${encodeURIComponent(studentId.trim().toUpperCase())}`;
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0F111A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}

export async function downloadQRCodePNG(studentId: string, studentName: string): Promise<void> {
  try {
    const dataUrl = await generateQRCodeDataUrl(studentId);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${studentId.trim().toUpperCase()}_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error downloading QR code:', err);
  }
}
