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

    // Try Shopify JSON API first (most reliable)
    const shopifyResult = await checkShopifyStock(url);
    
    if (shopifyResult !== null) {
      return new Response(
        JSON.stringify(shopifyResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Fallback to HTML scraping
    const htmlResult = await scrapeHtml(url);
    
    return new Response(
      JSON.stringify(htmlResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Shopify JSON API Stock Check - most reliable method (from your Python logic)
async function checkShopifyStock(productUrl: string): Promise<{ name: string; image: string; inStock: boolean } | null> {
  try {
    // Extract slug from URL
    const slug = productUrl.replace(/\/$/, '').split('/').pop();
    
    // Extract domain from URL
    const urlObj = new URL(productUrl);
    const domain = urlObj.origin;
    
    const jsonUrl = `${domain}/products/${slug}.js`;
    
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (response.status !== 200) {
      console.log('[Shopify JSON] Non-200 response, falling back to HTML');
      return null;
    }

    const data = await response.json();
    
    // Check if any variant is available (matching your Python logic)
    let inStock = false;
    for (const variant of data.variants || []) {
      if (variant.available === true) {
        inStock = true;
        break;
      }
    }
    
    // Get product image
    let image = 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80';
    if (data.featured_image) {
      image = data.featured_image.startsWith('//') 
        ? `https:${data.featured_image}` 
        : data.featured_image;
    } else if (data.images && data.images.length > 0) {
      image = data.images[0].startsWith('//')
        ? `https:${data.images[0]}`
        : data.images[0];
    }
    
    console.log(`[Shopify JSON] ${data.title}: ${inStock ? 'IN STOCK' : 'OUT OF STOCK'}`);
    
    return {
      name: data.title || cleanName(productUrl),
      image: image,
      inStock: inStock,
    };
  } catch (error) {
    console.log(`[Shopify JSON Error] ${error.message}`);
    return null;
  }
}

// Fallback HTML scraping
async function scrapeHtml(url: string): Promise<{ name: string; image: string; inStock: boolean }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    
    const html = await response.text();
    
    return {
      name: extractProductName(html, url),
      image: extractProductImage(html, url),
      inStock: evaluateStockStatus(html),
    };
  } catch (error) {
    console.log(`[HTML Scrape Error] ${error.message}`);
    return {
      name: cleanName(url),
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80',
      inStock: false,
    };
  }
}

// Evaluate stock status from HTML - based on your Python logic
function evaluateStockStatus(html: string): boolean {
  const lowerHtml = html.toLowerCase();
  
  // Check for c-button-cart div with presale class (Sonny Angel specific from your Python code)
  const buttonCartMatch = html.match(/class="([^"]*c-button-cart[^"]*)"/i);
  if (buttonCartMatch) {
    const classes = buttonCartMatch[1].toLowerCase();
    if (classes.includes('c-button-cart--pre-sale')) {
      console.log('[Evaluate] Found presale button → OOS');
      return false;
    }
  }
  
  // Check for "coming soon" or "sold" text (from your Python logic)
  if (/coming\s*soon/i.test(lowerHtml) || /sold\s*out/i.test(lowerHtml)) {
    console.log('[Evaluate] Found coming soon/sold out text → OOS');
    return false;
  }
  
  // Sold out patterns
  const soldOutPatterns = [
    /sold[\s-]?out/i,
    /out[\s-]?of[\s-]?stock/i,
    /not[\s-]?available/i,
    /currently[\s-]?unavailable/i,
    /notify[\s-]?me[\s-]?when/i,
    /email[\s-]?when[\s-]?available/i,
    /pre[\s-]?order/i,
    /coming[\s-]?soon/i,
  ];

  for (const pattern of soldOutPatterns) {
    if (pattern.test(html)) {
      console.log(`[Evaluate] Matched sold out pattern → OOS`);
      return false;
    }
  }

  // In stock patterns
  const inStockPatterns = [
    /add[\s-]?to[\s-]?cart/i,
    /add[\s-]?to[\s-]?bag/i,
    /buy[\s-]?now/i,
    /in[\s-]?stock/i,
  ];

  for (const pattern of inStockPatterns) {
    if (pattern.test(html)) {
      console.log(`[Evaluate] Matched in stock pattern → IN STOCK`);
      return true;
    }
  }

  // Default to out of stock if uncertain (matching your Python logic)
  console.log('[Evaluate] No clear indicators → defaulting to OOS');
  return false;
}

function extractProductName(html: string, url: string): string {
  // Try og:title first
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    return ogTitleMatch[1].trim();
  }
  
  // Try title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].split('|')[0].split('-')[0].trim();
  }

  // Try h1 tag
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  // Fallback to URL
  return cleanName(url);
}

function extractProductImage(html: string, baseUrl: string): string {
  // Try og:image first
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    const imgUrl = ogImageMatch[1];
    if (imgUrl.startsWith('//')) return `https:${imgUrl}`;
    if (imgUrl.startsWith('http')) return imgUrl;
    return new URL(imgUrl, baseUrl).toString();
  }

  // Try product image
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)[^>]*product[^>]*>/i);
  if (imgMatch && imgMatch[1]) {
    const imgUrl = imgMatch[1];
    if (imgUrl.startsWith('//')) return `https:${imgUrl}`;
    if (imgUrl.startsWith('http')) return imgUrl;
    return new URL(imgUrl, baseUrl).toString();
  }

  return 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80';
}

function cleanName(url: string): string {
  const slug = url.replace(/\/$/, '').split('/').pop() || 'Unknown Product';
  return slug
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
