export async function HandleCheckout(myData: CheckoutPayload) {
  try {
    const JSONdata = JSON.stringify(myData);
    const endpoint = "/api/checkout";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    });
    if (!response.ok) {
      console.error("Failed to send message");
      return;
    }

    const res = await response.json();
    return res;
  } catch (error) {
    // Handle fetch errors (e.g., network issues)
    console.error("Error sending message:", error);
  }
}
