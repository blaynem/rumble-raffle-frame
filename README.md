### TODOs

- "Entire Game" logs view

## NOTES SETTING UP DB for CRON job
- May have to set the extension for pg_net and pg_cron
- May have to push the `.env` to the supabase using one of the commands in the package.json

This is how we schedule the game to run hourly. Replace `project-ref` and `YOUR_ANON_KEY` with correct values.
```sql
-- select cron.unschedule('invoke-function-every-minute');

SELECT
  cron.schedule(
    'invoke-rumble-start-every-hour',
    '0 * * * *', -- at the top of every hour
    $$
    select
      net.http_post(
          url:='https://project-ref.supabase.co/functions/v1/run-rumble-hourly',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
          body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
  );
```

## Dev flow

Install all deps

```bash
npm install
```

1. Start Supabase (Requires docker to be up)
```bash
npx supabase start
```

2. Start the Frog Dev mode + Rumble Frame
You'll need two separate terminals for this.

Start the dev server
```bash
npm run dev
```

Start the frog frame, then past in your localhost link
```bash
npm run dev:frog
```



3. If testing with Warpcast Frame Validator
Note: The localhost port depends on what `npm run dev` outputs.

```bash
ngrok http http://localhost:3000
```

### Supabase / Prisma

Prisma is a neat database ORM that allows us to create migrations, and evolve our data over time.
Supabase is the database host.

Any time we update the prisma schema, run `npx prisma generate` to update the generated types.

Start / Stop Supabase Local CLI

```bash
npx supabase start
npx supabase stop
```

To seed the database, run the following command:
```bash
npx prisma db seed
```


### Rumble Frame Start
```bash
npm install
npm run dev
```

Head to http://localhost:5173/api

### Working with Farcaster Accounts Locally

If we do NOT need to verify anything with Farcaster accounts, we can continue developing locally. Otherwise, read on.

_Why_ do we need to work with Farcaster acocunts? We need to get the `fid` which we can then get the users verified eth address.

`hubs` in the frog initializer are what gets us the trusted data from the Farcaster network.

_Note: In the future we will not want to gate this app to Farcaster users only._

If you interact with the frame right now you'll notice that we either get errors, or the `verified` returns false.
In order to get this working locally, we need to set up `ngrok` which allows us to verify a users Farcaster id with their eth address.

### Setup Ngrok

Ngrok is a free tool. Just sign up, then follow the instructions to install it on your machine.

NOTE: Make sure Frog is running before starting `ngrok`!

1. Start the `ngrok` server

    ```bash
    ngrok http http://localhost:5173
    ```
    _Note: This should be the same port as the frame above._

2. After starting you will see a screen like below. 
    
    Click the "Forwarding" link, in this example ` https://ab6c-50-39-160-155.ngrok-free.app`
    ![Ngrok Example1](docs/images/ngrok1.png)

    2b. It will open a new browser window, where we click `Visit Site`, which will then reload and you will likely see a big empty screen. THIS IS FINE.
    ![Ngrok Example2](docs/images/ngrok2.png)

3. Visit `https://warpcast.com/~/developers/frames`, and input the Forwarding link from the step above. It should look something like this:
    ![Ngrok Example3](docs/images/ngrok3.png)