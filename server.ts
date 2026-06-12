import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data';

// Initialize Gemini SDK with telemetry user agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Configure Database File (SQLite alternative for Square Cloud container file-system)
const DB_FILE_PATH = path.join(process.cwd(), 'products-db.json');

function readDatabase(): any[] {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      writeDatabase(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    const rawData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Fallback read database error, re-initializing with default:', err);
    return INITIAL_PRODUCTS;
  }
}

function writeDatabase(data: any[]) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file to Square Cloud:', err);
  }
}

async function startServer() {
  const app = express();
  // Live in Square Cloud or other server port standard environment variables defaults to 3000
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Database seed control
  readDatabase();

  // API health checks or custom backend routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'Square Cloud Ready' });
  });

  // REST API: GET all active products from persistent database
  app.get('/api/products', (req, res) => {
    try {
      const data = readDatabase();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao carregar os achados.' });
    }
  });

  // REST API: POST a new product securely (persisted permanently for all users)
  app.post('/api/products', (req, res) => {
    try {
      const newProduct = req.body;
      if (!newProduct || !newProduct.title || !newProduct.affiliateUrl) {
        return res.status(400).json({ error: 'Título e link afiliado são obrigatórios.' });
      }

      const products = readDatabase();
      
      // Auto-assign properties if missing
      const formattedProduct = {
        ...newProduct,
        id: newProduct.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clicks: newProduct.clicks || 0,
        date: newProduct.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
        rating: newProduct.rating || Number((4.5 + Math.random() * 0.5).toFixed(1))
      };

      // Prepend so new products show at the top of the feed
      products.unshift(formattedProduct);
      writeDatabase(products);

      res.status(201).json(formattedProduct);
    } catch (err) {
      res.status(500).json({ error: 'Falha ao salvar produto no banco de dados.' });
    }
  });

  // REST API: PUT / UPDATE an existing product
  app.put('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const products = readDatabase();
      
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      // Preserve permanent data and merge changes
      products[index] = {
        ...products[index],
        ...updatedData,
        id // security lock to ensure ID doesn't change
      };

      writeDatabase(products);
      res.json(products[index]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar produto no banco de dados.' });
    }
  });

  // REST API: DELETE a product
  app.delete('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const products = readDatabase();
      
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado no banco.' });
      }

      const deleted = products.splice(index, 1);
      writeDatabase(products);

      res.json({ message: 'Deletado com sucesso', item: deleted[0] });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao excluir item do banco.' });
    }
  });

  // REST API: Increment clicks counter securely
  app.post('/api/products/:id/click', (req, res) => {
    try {
      const { id } = req.params;
      const products = readDatabase();
      
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products[index].clicks = (products[index].clicks || 0) + 1;
        writeDatabase(products);
        res.json({ success: true, clicks: products[index].clicks });
      } else {
        res.status(404).json({ error: 'Produto não encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Erro ao computar cliques' });
    }
  });

  // Smart Shopee Copied Message Parser & Copywriter Generator
  app.post('/api/gemini/generate-ad', async (req, res) => {
    const { inputText, style } = req.body;
    if (!inputText) {
      return res.status(400).json({ error: 'Texto de entrada é obrigatório' });
    }

    const handleFallback = () => {
      // URL extraction
      const urlRegex = /(https?:\/\/[^\s]+)/;
      const urlMatch = inputText.match(urlRegex);
      const affiliateUrl = urlMatch ? urlMatch[0] : 'https://shope.ee/default';

      // Price extraction
      const priceRegex = /(?:R\$|r\$)\s*([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)/gi;
      const prices: number[] = [];
      let match;
      while ((match = priceRegex.exec(inputText)) !== null) {
        const priceStr = match[1].replace(/\./g, '').replace(',', '.');
        const p = parseFloat(priceStr);
        if (!isNaN(p)) {
          prices.push(p);
        }
      }

      let originalPrice: number | undefined = undefined;
      let discountPrice: number | undefined = undefined;
      if (prices.length >= 2) {
        const sorted = [...new Set(prices)].sort((a,b) => b - a);
        originalPrice = sorted[0];
        discountPrice = sorted[1];
      } else if (prices.length === 1) {
        discountPrice = prices[0];
        originalPrice = Math.round(prices[0] * 1.35 * 100) / 100;
      } else {
        discountPrice = 19.90;
        originalPrice = 29.90;
      }

      // Category detection
      const lower = inputText.toLowerCase();
      let category = 'outros';
      let imageUrl = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'; // Default Outros
      if (lower.includes('roupa') || lower.includes('vestid') || lower.includes('camis') || lower.includes('moda') || lower.includes('blusa') || lower.includes('short') || lower.includes('pijama') || lower.includes('renda')) {
        category = 'moda';
        imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
      } else if (lower.includes('casa') || lower.includes('cozinha') || lower.includes('panela') || lower.includes('limpez') || lower.includes('mop') || lower.includes('decor') || lower.includes('porta chaves') || lower.includes('mdf')) {
        category = 'casa';
        imageUrl = 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=600';
      } else if (lower.includes('bebe') || lower.includes('brinqued') || lower.includes('crianc') || lower.includes('bebé') || lower.includes('infantil')) {
        category = 'bebe-brinquedos';
        imageUrl = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600';
      } else if (lower.includes('tenis') || lower.includes('sapat') || lower.includes('chinel') || lower.includes('calcado')) {
        category = 'calcados';
        imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';
      } else if (lower.includes('video') || lower.includes('pack') || lower.includes('canal') || lower.includes('drive')) {
        category = 'packs-videos';
        imageUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600';
      } else if (lower.includes('alugar') || lower.includes('aluguel') || lower.includes('casas para alugar') || lower.includes('imovel') || lower.includes('imóvel')) {
        category = 'aluguel';
        imageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600';
      }

      let cleanedText = inputText
        .replace(urlRegex, '')
        .replace(/(?:R\$|r\$)\s*[0-9.,]+/gi, '')
        .replace(/dê uma olhada em/gi, '')
        .replace(/veja no link/gi, '')
        .replace(/[\\/*_#]/g, '')
        .trim();

      if (cleanedText.length > 50) {
        cleanedText = cleanedText.slice(0, 47) + '...';
      }
      if (!cleanedText) cleanedText = 'Super Achadinho do Dia';

      let titlePrefix = '🛍️';
      if (style === 'Em Chamas') titlePrefix = '🔥';
      else if (style === 'Super Oferta') titlePrefix = '💥';
      else if (style === 'Elegante') titlePrefix = '✨';
      else if (style === 'Urgente') titlePrefix = '⚡';

      const title = `${titlePrefix} ${cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1)}`;

      let description = '';
      if (style === 'Em Chamas') {
        description = `🔥 OFERTA QUENTE! Oportunidade imperdível de garantir esse achado incrível por muito menos! Clientes satisfeitos avaliam com nota máxima. Link seguro por tempo reduzido!`;
      } else if (style === 'Super Oferta') {
        description = `💥 PREÇO EXPLOSIVO! Economize de verdade agora com esse achadinho selecionado a dedo com super preço. Não fique de fora e clique para aproveitar!`;
      } else if (style === 'Elegante') {
        description = `✨ Um toque de bom gosto, conforto e durabilidade premium. Ideal para transformar seu dia com muita praticidade e design funcional incomparável.`;
      } else { // Urgente
        description = `⚡ CORRE! Menor preço garantido só nas próximas horas. Últimas unidades no estoque promocional. Clique no link e fature essa mega vantagem imediatamente!`;
      }

      return {
        title,
        description,
        category,
        originalPrice,
        discountPrice,
        affiliateUrl,
        imageUrl,
        platforms: 'shopee'
      };
    };

    if (!process.env.GEMINI_API_KEY) {
      console.log('Chave do Gemini API não configurada. Executando fallback inteligente...');
      return res.json(handleFallback());
    }

    try {
      const prompt = `Você é o gerador oficial de copywriting profissional para o "BASS COMPRE MAIS" (site de achadinhos afiliados no Brasil).
Analise o texto fornecido pelo usuário (que costuma conter fragmentos copiados de promoções, títulos de produtos da Shopee, preços, links, etc).
Crie um anúncio maravilhoso e persuasivo em português do Brasil conforme o seguinte estilo selecionado: "${style || 'Super Oferta'}".

Estilos disponíveis:
- "Em Chamas": copy super quente, empolgante, emojis de fogo, senso de urgência máxima, exclamações, "ESTOQUE VOANDO!".
- "Super Oferta": focado em desconto massivo, economia inteligente, "MELHOR PREÇO DO ANO!", preço de oportunidade única, emojis de explosões.
- "Elegante": tom calmo, focado em sofisticação, maciez, alta qualidade, durabilidade, emojis discretos e refinados, ideal para roupas elegantes ou decoração de casa fina.
- "Urgente": foco total no tempo limite, cronômetro, "ÚLTIMAS UNIDADES!", links ativos rápidos, emojis de raios e pressa, induz a fechar negócio na hora.

Retorne OBRIGATORIAMENTE um objeto JSON válido correspondente ao seguinte esquema exato:
- "title": Título curto estético de até 60 caracteres com emoji temático no início.
- "description": Copy comercial super persuasiva e envolvendo, com formatação organizada, emojis elegantes dispersos, destacando os reais benefícios do produto. Máximo de 250 caracteres.
- "category": Deve ser obrigatoriamente um destes textos exatos: 'moda' | 'casa' | 'bebe-brinquedos' | 'calcados' | 'packs-videos' | 'aluguel' | 'outros'
- "originalPrice": O preço original do produto extraído do texto como número (ex: 89.90), ou null se não houver um preço ou se for igual ao valor com desconto.
- "discountPrice": O preço final com desconto extraído do texto como número (ex: 39.90), ou null se não houver. Se apenas houver um valor numérico, considere-o como o preço promocional (discountPrice) e calcule o originalPrice como sendo aproximadamente 30% a 40% maior para dar efeito estético de promoção.
- "affiliateUrl": O link promocional extraído do texto. Se não houver, crie ou retorne o original.
- "keywords": 2 ou 3 palavras-chave representativas do produto para busca de imagem (ex: "tenis corrida masculino").

Instruções adicionais importantes para preços:
- Remova moedas como "R$" ou símbolos antes de converter para número decimal.
- Garanta que originalPrice e discountPrice sejam objetos numéricos (números inteiros ou decimais) e NUNCA strings no JSON.

Texto de entrada:
"${inputText}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              originalPrice: { type: Type.NUMBER },
              discountPrice: { type: Type.NUMBER },
              affiliateUrl: { type: Type.STRING },
              keywords: { type: Type.STRING }
            },
            required: ['title', 'description', 'category', 'affiliateUrl']
          }
        }
      });

      const resultText = response.text || '';
      const parsedData = JSON.parse(resultText);

      // Map categories and choose default background images based on categories or keywords
      let imageUrl = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'; // Default Outros
      const cat = parsedData.category || 'outros';
      const keywordsLower = (parsedData.keywords || '').toLowerCase();
      
      // Choose curated image preset
      if (cat === 'moda' || keywordsLower.includes('vestido') || keywordsLower.includes('roupa') || keywordsLower.includes('camisa')) {
        imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';
      } else if (cat === 'calcados' || keywordsLower.includes('tenis') || keywordsLower.includes('sapato') || keywordsLower.includes('chinelo')) {
        imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';
      } else if (cat === 'casa' || keywordsLower.includes('cozinha') || keywordsLower.includes('decor') || keywordsLower.includes('organiz') || keywordsLower.includes('panela')) {
        imageUrl = 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=600';
      } else if (cat === 'bebe-brinquedos' || keywordsLower.includes('brinquedo') || keywordsLower.includes('bebe') || keywordsLower.includes('crianca')) {
        imageUrl = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600';
      } else if (cat === 'aluguel' || keywordsLower.includes('casa') || keywordsLower.includes('apartamento') || keywordsLower.includes('quarto')) {
        imageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600';
      } else if (cat === 'packs-videos' || keywordsLower.includes('pack') || keywordsLower.includes('video') || keywordsLower.includes('criativo')) {
        imageUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600';
      }

      res.json({
        title: parsedData.title,
        description: parsedData.description,
        category: parsedData.category,
        originalPrice: parsedData.originalPrice,
        discountPrice: parsedData.discountPrice,
        affiliateUrl: parsedData.affiliateUrl,
        imageUrl,
        platforms: 'shopee'
      });
    } catch (err) {
      console.error('Falha ao processar com Gemini. Ativando fallback inteligente:', err);
      res.json(handleFallback());
    }
  });

  // Automatically detect if running as pre-compiled bundle or explicitly marked as production
  const isProd = process.env.NODE_ENV === 'production' || 
                 (typeof __filename !== 'undefined' && !__filename.endsWith('.ts')) ||
                 path.basename(process.argv[1] || '').startsWith('server.cjs');

  // Serve with Vite Dev Middleware in local / development, or static assets in production
  if (isProd) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      // Dynamic import to prevent crash in production environments where devDependencies are not installed
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite not found or failed to load. Falling back to static file delivery:', err);
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is booted successfully on port ${PORT}!`);
  });
}

startServer();
