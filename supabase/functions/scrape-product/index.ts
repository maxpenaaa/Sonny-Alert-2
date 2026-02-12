const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const response = await fetch(url);
    const html = await response.text();

    const productData = {
      name: extractProductName(html),
      image: extractProductImage(html, url),
      inStock: checkStockStatus(html),
    };

    return new Response(
      JSON.stringify(productData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function extractProductName(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].split('|')[0].trim();
  }

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  return 'Unknown Product';
}

function extractProductImage(html: string, baseUrl: string): string {
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    const imgUrl = ogImageMatch[1];
    return imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, baseUrl).toString();
  }

  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch && imgMatch[1]) {
    const imgUrl = imgMatch[1];
    return imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, baseUrl).toString();
  }

  return 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80';
}

function checkStockStatus(html: string): boolean {
  const soldOutPatterns = [
    /sold[\s-]?out/i,
    /out[\s-]?of[\s-]?stock/i,
    /not[\s-]?available/i,
    /currently[\s-]?unavailable/i,
    /notify[\s-]?me/i,
    /email[\s-]?when[\s-]?available/i,
  ];

  const inStockPatterns = [
    /in[\s-]?stock/i,
    /add[\s-]?to[\s-]?cart/i,
    /buy[\s-]?now/i,
    /purchase/i,
  ];

  const lowerHtml = html.toLowerCase();

  for (const pattern of soldOutPatterns) {
    if (pattern.test(lowerHtml)) {
      return false;
    }
  }

  for (const pattern of inStockPatterns) {
    if (pattern.test(lowerHtml)) {
      return true;
    }
  }

  return false;
}
