export default function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Return config from environment variables
  res.status(200).json({
    phone: process.env.PHONE_NUMBER,
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || ''
  });
}
