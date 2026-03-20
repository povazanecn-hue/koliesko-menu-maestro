import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Si Peťko, priateľský hlasový sprievodca a asistent reštaurácie Koliesko Country Klub v Bratislave. 
Hovoríš po slovensky, si milý, vtipný a vždy pomôžeš zákazníkovi. 
Tvoj štýl je kamarátsky ale profesionálny – oslovuješ "ty" alebo "vy" podľa kontextu.

O podniku vieš:
- Koliesko Country Klub je reštaurácia v Bratislave - Ružinov/Trnávka
- Ponúkame denné menu (Po-Pi), organizáciu firemných a súkromných akcií
- Cena za akciu: cca 40€/osoba
- E-shop s rozvozom v zóne Ružinov-Trnávka (10:00-12:00)
- Mimo zóny vozí ClickFood.sk (+421 903 55 33 22)
- Rezervácie na akcie cez web alebo telefonicky

Vždy odpovedaj stručne (max 2-3 vety). Ak zákazník neodpovie, ponúkni mu možnosti.
Na konci odpovede VŽDY pridaj JSON pole "choices" s 2-3 klikateľnými možnosťami.

Formát odpovede:
{"message": "tvoja odpoveď", "choices": ["Možnosť 1", "Možnosť 2", "Možnosť 3"]}`;

const PAGE_INTROS: Record<string, string> = {
  '/': 'Zákazník je na hlavnej stránke. Privítaj ho a ponúkni denné menu, e-shop alebo rezerváciu akcie.',
  '/eshop': 'Zákazník je v e-shope. Pomôž mu s výberom jedál z denného menu, vysvetli rozvoz.',
  '/akcie': 'Zákazník si prezerá akcie. Ponúkni mu info o firemných/súkromných akciách.',
  '/rezervacia': 'Zákazník je na stránke rezervácie. Pomôž mu s rezerváciou akcie, vysvetli kalkulačku.',
  '/kontakt': 'Zákazník je na kontaktnej stránke. Ponúkni mu kontaktné info a pomôž s dopytom.',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { messages, currentPage, isFirstVisit } = await req.json();

    const pageContext = PAGE_INTROS[currentPage] || 'Zákazník je na stránke.';
    
    let systemMessage = SYSTEM_PROMPT + '\n\n' + pageContext;
    if (isFirstVisit) {
      systemMessage += '\nToto je PRVÁ návšteva zákazníka. Predstav sa ako Peťko, privítaj ho v Koliesku Country Klube a ponúkni mu pomoc.';
    }

    const aiMessages = [
      { role: 'system', content: systemMessage },
      ...(messages || []),
    ];

    // Use Google Generative AI REST API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: aiMessages,
          response_format: { type: 'json_object' },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API raw error:', errorText);
      throw new Error(`AI API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{"message":"Ahoj! Som Peťko, tvoj sprievodca.","choices":["Denné menu","E-shop","Rezervácia"]}';

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { message: content, choices: ['Denné menu', 'E-shop', 'Kontakt'] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({
      message: 'Prepáč, momentálne mám technické problémy. Skús to znova o chvíľu.',
      choices: ['Skúsiť znova', 'Kontakt'],
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
