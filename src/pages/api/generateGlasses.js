import { OpenAI } from "openai";
import fs from "node:fs";
import path from "node:path";

// Ensure this API route runs in server mode (required for POST with output: 'static')
export const prerender = false;

// Prefer Astro env vars, fallback to process.env for safety
let BASE_URL = import.meta.env?.OR_URL || process.env.OR_URL || ""; // URL de l'API OpenRouter
let OR_TOKEN = import.meta.env?.OR_TOKEN || process.env.OR_TOKEN || "";
let HF_URL = import.meta.env?.HF_URL || process.env.HF_URL || "";
let HF_TOKEN = import.meta.env?.HF_TOKEN || process.env.HF_TOKEN || "";

// Fallback: try to load from a custom local env file (sensible.env) if nothing is set
try {
    if (!OR_TOKEN && !HF_TOKEN) {
        const envPath = path.resolve(process.cwd(), "sensible.env");
        if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, "utf-8");
            for (const line of raw.split(/\r?\n/)) {
                const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"?([^"#\r\n]+)"?\s*$/);
                if (m) {
                    const key = m[1];
                    const val = m[2].trim();
                    if (key === "OR_URL") BASE_URL = val;
                    if (key === "OR_TOKEN") OR_TOKEN = val;
                    if (key === "HF_URL") HF_URL = val;
                    if (key === "HF_TOKEN") HF_TOKEN = val;
                }
            }
        }
    }
} catch (e) {
    console.warn("Impossible de charger sensible.env:", e);
}

// Sanitize tokens (strip quotes/spaces if any)
OR_TOKEN = (OR_TOKEN || "").toString().trim().replace(/^['"]|['"]$/g, "");
HF_TOKEN = (HF_TOKEN || "").toString().trim().replace(/^['"]|['"]$/g, "");

export const POST = async ({ request }) => {
    console.log("Requête de génération de lunettes reçue");

    // Choose provider based on available tokens
    const useOpenRouter = !!OR_TOKEN;
    const useHuggingFace = !useOpenRouter && !!HF_TOKEN;
    console.log("Provider:", useOpenRouter ? "OpenRouter" : (useHuggingFace ? "HuggingFace" : "None"));
    console.log("BASE_URL:", useOpenRouter ? (BASE_URL || "https://openrouter.ai/api/v1") : (HF_URL || "https://router.huggingface.co/v1"));
    if (!useOpenRouter && !useHuggingFace) {
        return new Response(JSON.stringify({
            success: false,
            error: "API non configurée : fournissez OR_TOKEN (OpenRouter) ou HF_TOKEN (HuggingFace) dans .env ou sensible.env",
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // Extraction du prompt et du modèle du corps de la requête (robuste si vide)
    let prompt = "";
    let model = "gpt-4o-mini";
    let mood = null;
    let colorPreference = null;
    try {
        const body = await request.json();
        prompt = body?.prompt || "";
        model = body?.model || model;
        mood = body?.mood || null;
        colorPreference = body?.colorPreference || null;
    } catch (e) {
        // Pas de body JSON fourni
        console.warn("Aucun corps JSON fourni à l'API generateGlasses");
    }
    
    // Initialisation du client OpenAI avec l'URL de base et le token d'API
    const client = new OpenAI({
        baseURL: useOpenRouter ? (BASE_URL || "https://openrouter.ai/api/v1") : (HF_URL || "https://router.huggingface.co/v1"),
        apiKey: useOpenRouter ? OR_TOKEN : HF_TOKEN,
        // headers additionnels possibles (OpenRouter):
        // defaultHeaders: useOpenRouter ? {
        //     "HTTP-Referer": "http://localhost:4321",
        //     "X-Title": "SAE301 Configurateur Lunettes",
        // } : undefined,
    });
    
    // Création du message système pour guider le modèle
    const systemMessage = {
        role: "system",
        content: `You are an expert color palette designer for eyewear. Your task is to generate harmonious color combinations based on user descriptions.

IMPORTANT RULES:
1. ALWAYS respond with a valid JSON object
2. Generate realistic color hex codes that match the user's description
3. Create harmonious color palettes (complementary, analogous, or monochromatic)
4. Suggest materials that complement the color scheme
5. Consider the mood and context (professional, casual, artistic, etc.)
6. Include a brief explanation of the color choices
7. Do NOT include any explanatory text outside the JSON

Required JSON format:
{
  "monture": {
    "color": "#HEX",
    "material": "Material name"
  },
  "branches": {
    "color": "#HEX", 
    "material": "Material name"
  },
  "verres": {
    "color": "#HEX",
    "type": "Lens type"
  },
  "size": "M",
  "explanation": "Brief explanation of the color palette and why it works"
}

Example color palettes:
- Classic Black & Gold: monture #000000, branches #D4AF37, verres #1A1A1A
- Ocean Blue: monture #003366, branches #0066CC, verres #87CEEB
- Vintage Tortoise: monture #8B4513, branches #CD853F, verres #FFA500
- Rose Gold Elegance: monture #B76E79, branches #E0AC9D, verres #FFF5EE

Example materials: Acétate, Aluminum, Bois, Acier, Titane, Gunmetal
Example lens types: Classique, Anti-lumière bleue, Solaire, Photochromique, Polarisé

Focus on creating visually appealing and wearable color combinations.`
    };
    
    // Construction du message utilisateur avec contexte
    let userPrompt = `Create a color palette for eyewear based on:\n\n`;
    userPrompt += `Color description: ${prompt}\n`;
    if (mood) userPrompt += `Mood/Style: ${mood}\n`;
    if (colorPreference) userPrompt += `Color preference: ${colorPreference}\n`;
    userPrompt += `\nGenerate harmonious colors for the frame (monture), temples (branches), and lenses (verres) in JSON format. Focus on creating a cohesive and stylish color scheme.`;
    
    const userMessage = {
        role: "user",
        content: userPrompt
    };
    
    // Mapping des modèles
    // Map model names to provider-specific model IDs
    const modelMappingOpenRouter = {
        "gpt-4o-mini": "openai/gpt-4o-mini", 
        "gpt-4o": "openai/gpt-4o",
        "claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
        "deepseek-coder": "deepseek/deepseek-coder",
        "qwen-coder": "qwen/qwen-2.5-coder-32b-instruct",
        "codellama": "meta-llama/codellama-34b-instruct",
        "mistral-7b": "mistralai/mistral-7b-instruct:free",
        "llama-3.1": "meta-llama/llama-3.1-8b-instruct:free"
    };

    const modelMappingHF = {
        "gpt-4o-mini": "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "gpt-4o": "meta-llama/Meta-Llama-3.1-70B-Instruct",
        "claude-3.5-sonnet": "Qwen/Qwen2.5-72B-Instruct",
        "deepseek-coder": "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct",
        "qwen-coder": "Qwen/Qwen2.5-Coder-32B-Instruct",
        "codellama": "codellama/CodeLlama-34b-Instruct-hf",
        "mistral-7b": "mistralai/Mistral-7B-Instruct-v0.2",
        "llama-3.1": "meta-llama/Meta-Llama-3.1-8B-Instruct"
    };

    const selectedModel = (useOpenRouter ? modelMappingOpenRouter : modelMappingHF)[model] || (useOpenRouter ? "openai/gpt-4o-mini" : "meta-llama/Meta-Llama-3.1-8B-Instruct");
    console.log("Modèle utilisé:", selectedModel);
    
    try {
        // Appel à l'API
        let message;
        if (useHuggingFace) {
            // Direct fetch to HF OpenAI-compatible endpoint to avoid SDK incompatibilities
            const primary = (HF_URL || 'https://router.huggingface.co/v1').replace(/\/?$/,'') + '/chat/completions';
            const secondary = 'https://api-inference.huggingface.co/v1/chat/completions';
            const doReq = async (endpoint) => fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [systemMessage, userMessage],
                    temperature: 0.7,
                    max_tokens: 1000,
                    top_p: 1.0
                })
            });
            let resp = await doReq(primary);
            if (resp.status === 401) {
                console.warn('HF router returned 401, retrying with api-inference endpoint');
                resp = await doReq(secondary);
            }
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`HF API error ${resp.status}: ${txt}`);
            }
            const json = await resp.json();
            message = json.choices?.[0]?.message || { content: '' };
        } else {
            const chatCompletion = await client.chat.completions.create({
                model: selectedModel,
                messages: [systemMessage, userMessage],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 1.0
            });
            message = chatCompletion.choices[0].message;
        }
        
        let content = message.content || "";
        
        console.log("Réponse brute de l'IA:", content);
        
        // Nettoyage et extraction du JSON
        if (content.includes('```')) {
            content = content.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
        }
        
        // Tentative de parsing JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            try {
                const config = JSON.parse(jsonMatch[0]);
                
                // Validation et normalisation
                const normalizedConfig = {
                    monture: {
                        color: config.monture?.color || '#8B8B8B',
                        material: config.monture?.material || 'Aluminum',
                        price: 15
                    },
                    branches: {
                        color: config.branches?.color || '#D3D3D3',
                        material: config.branches?.material || 'Gunmetal',
                        price: 0
                    },
                    verres: {
                        color: config.verres?.color || '#E0F2FF',
                        type: config.verres?.type || 'Classique',
                        price: 0
                    },
                    size: config.size || 'M',
                    sizePrice: config.size === 'L' ? 5 : (config.size === 'S' ? -5 : 0),
                    explanation: config.explanation || 'Configuration générée par IA',
                    totalPrice: 89.99 + (config.size === 'L' ? 5 : (config.size === 'S' ? -5 : 0)) + 15
                };
                
                console.log("Configuration générée:", normalizedConfig);
                
                return new Response(JSON.stringify({ 
                    success: true,
                    config: normalizedConfig 
                }), {
                    headers: { "Content-Type": "application/json" },
                });
                
            } catch (parseError) {
                console.error("Erreur de parsing JSON:", parseError);
            }
        }
        
        // Si échec, configuration par défaut
        throw new Error("Format de réponse invalide");
        
    } catch (error) {
        const details = (error && typeof error === 'object' && 'response' in error) ? (error.response?.data || error.response?.statusText) : undefined;
        console.error("Erreur lors de la génération:", error);
        if (details) console.error("Détails:", details);
        
        // Configuration de secours
        return new Response(JSON.stringify({ 
            success: false,
            error: details || (error?.message || 'Unknown error'),
            provider: useOpenRouter ? 'OpenRouter' : (useHuggingFace ? 'HuggingFace' : 'None'),
            baseURL: useOpenRouter ? (BASE_URL || 'https://openrouter.ai/api/v1') : (HF_URL || 'https://router.huggingface.co/v1'),
            model: selectedModel,
            config: {
                monture: { color: '#000000', material: 'Acétate', price: 0 },
                branches: { color: '#8B8B8B', material: 'Aluminum', price: 15 },
                verres: { color: '#E0F2FF', type: 'Classique', price: 0 },
                size: 'M',
                sizePrice: 0,
                explanation: 'Configuration par défaut (erreur IA)',
                totalPrice: 104.99
            }
        }), {
            headers: { "Content-Type": "application/json" },
        });
    }
};
