// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// TODO: Make a CRON that runs every hour. We want to be able to turn it off as well.

Deno.serve(async (req) => {
  const RUMBLE_API_URL = Deno.env.get("RUMBLE_API_URL");
  // password for starting game = "SUPER_SECRET_PASSWORD"

  const gameStarted = await fetch(
    `${RUMBLE_API_URL}/api/webhooks/startGame`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "SUPER_SECRET_PASSWORD",
      }),
    },
  );

  return new Response(
    JSON.stringify({ gameStarted }),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/run-rumble-hourly' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
