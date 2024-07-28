type generateAccessTokenResponse = {
  access_token: string;
};

type Options = {
  name: string;
  email: string;
  amount: number;
};

export async function createOrder(accessToken: string, options: Options) {
  const response = await fetch(
    "https://api-m.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: options.amount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: options.amount.toFixed(2),
                },
              },
            },
            items: [
              {
                name: "Donation",
                quantity: "1",
                unit_amount: {
                  currency_code: "USD",
                  value: options.amount.toFixed(2),
                },
                description: "Tharindu Nimesh:tharindunimesh.abc@gmail.com",
              },
            ],
          },
        ],
        application_context: {
          return_url: `http://localhost:8787/api/v1/donate/payment-success?name=${encodeURIComponent(options.name)}&email=${encodeURIComponent(options.email)}`,
          cancel_url: "http://localhost:3000/donation-cancel",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function generateAccessToken(
  clientId: string,
  clientSecret: string
) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(
    "https://api-m.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate access token: ${response.statusText}`);
  }

  const data: generateAccessTokenResponse =
    (await response.json()) as generateAccessTokenResponse;
  return data.access_token;
}
