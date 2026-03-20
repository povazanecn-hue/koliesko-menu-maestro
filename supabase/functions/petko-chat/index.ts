import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Si Peťo, priateľský hlasový sprievodca a asistent reštaurácie Koliesko Country Klub v Bratislave. 
Hovoríš po slovensky, si milý, vtipný a vždy pomôžeš zákazníkovi. 
Tvoj štýl je kamarátsky ale profesionálny.

O podniku vieš:
- Koliesko Country Klub je reštaurácia v Bratislave - Ružinov/Trnávka
- Ponúkame denné menu (Po-Pi), organizáciu firemných a súkromných akcií
- Cena za akciu: cca 40€/osoba
- E-shop s rozvozom v zóne Ružinov-Trnávka (10:00-12:00)
- Mimo zóny vozí ClickFood.sk (+421 903 55 33 22)
- Rezervácie na akcie cez web alebo telefonicky

Vždy odpovedaj stručne (max 2-3 vety). Ponúkni klikateľné možnosti.
Odpoveď MUSÍ byť platný JSON: {"message": "text", "choices": ["Možnosť 1", "Možnosť 2"]}`;

const PAGE_INTROS: Record<string, string> = {
  '/': 'Zákazník je na hlavnej stránke. Privítaj ho a ponúkni denné menu, e-shop alebo rezerváciu akcie.',
  '/denne-menu': 'Zákazník si prezerá denné menu. Pomôž mu s výberom, vysvetli možnosť takeaway.',
  '/menu': 'Zákazník si prezerá stály jedálny lístok. Odporuč špeciality.',
  '/eshop': 'Zákazník je v e-shope. Pomôž mu s výberom jedál, vysvetli rozvoz.',
  '/akcie': 'Zákazník si prezerá akcie. Ponúkni info o firemných/súkromných akciách.',
  '/rezervacia': 'Zákazník je na stránke rezervácie. Pomôž mu s rezerváciou, vysvetli kalkulačku.',
  '/kontakt': 'Zákazník je na kontaktnej stránke. Ponúkni kontaktné info.',
  '/o-nas': 'Zákazník je na stránke O nás. Povedz niečo o histórii a hodnotách Kolieska.',
  '/galeria': 'Zákazník si prezerá galériu. Ponúkni mu info o priestoroch a akciách.',
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
      systemMessage += '\nToto je PRVÁ návšteva zákazníka. Predstav sa ako Peťo a privítaj ho.';
    }

    const aiMessages = [
      { role: 'system', content: systemMessage },
      ...(messages || []),
    ];

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: aiMessages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error [${response.status}]`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { message: content || 'Ahoj! Som Peťo.', choices: ['Denné menu', 'E-shop', 'Kontakt'] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat Error:', error);
    return new Response(JSON.stringify({
      message: 'Ahoj! Som Peťo, tvoj sprievodca v Koliesku Country Klube. Čo ťa zaujíma?',
      choices: ['Denné menu', 'E-shop', 'Rezervácia akcie'],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
