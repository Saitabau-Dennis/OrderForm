import AfricasTalking from "africastalking";

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY || "", 
  username: process.env.AT_USERNAME || "sandbox"
});

export const sendSMS = async (to: string, message: string) => {
  if (!process.env.AT_API_KEY) {
    console.warn("Skipping SMS: AT_API_KEY not found in environment variables.");
    return { success: false, error: "Missing API Key" };
  }

  try {
    const result = await africastalking.SMS.send({
      to: [to],
      message: message,
      // from: "YourSenderID" // Optional, defaults to "AFRICASTKNG" or sandbox
    });
    console.log("SMS sent successfully:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error };
  }
};
