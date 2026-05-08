import { sendMail } from "../config/mailer.js";
import { OpenAI } from "openai";

// Lazy-load OpenAI to avoid errors if API key is missing
let openai = null;

const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export const sendContactMessage = async (req, res) => {
  const { name, email, subject = "New Contact Message", message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ msg: "Name, email and message are required" });
  }

  try {
    // Send email to admin
    await sendMail({
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
      subject: `🏔️ Monastery360: ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🏔️ New Message from Tourist</h2>
          <hr style="border: none; border-top: 2px solid #ecf0f1;">
          
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <h3 style="color: #34495e;">Message:</h3>
          <p style="background: #ecf0f1; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </p>
          
          <hr style="border: none; border-top: 1px solid #bdc3c7;">
          <p style="color: #7f8c8d; font-size: 12px;">
            Received on: ${new Date().toLocaleString("en-IN")}
          </p>
        </div>
      `,
    });

    // Send confirmation to user
    await sendMail({
      to: email,
      subject: "🏔️ We received your message - Monastery360",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you, ${name}!</h2>
          <p>We have received your message and will get back to you soon.</p>
          <p><strong>Your message:</strong></p>
          <p style="background: #ecf0f1; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </p>
          <p>Best regards,<br><strong>Monastery360 Team</strong></p>
        </div>
      `,
    });

    res.json({
      msg: "Message sent successfully! Check your email for confirmation.",
      status: "success",
    });
  } catch (err) {
    console.error("Contact error:", err.message);
    res.status(500).json({
      error: "Failed to send message. Please try again.",
      details: err.message,
    });
  }
};

// AI Chat Assistant using OpenAI
let chatHistory = [];

export const aiChat = async (req, res) => {
  const { message, reset = false } = req.body;

  if (!message && !reset) {
    return res.status(400).json({ msg: "Message is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(400)
      .json({ msg: "AI service not configured. Please contact admin." });
  }

  try {
    // Reset chat history if requested
    if (reset) {
      chatHistory = [];
      return res.json({
        msg: "Chat history cleared",
        response: "How can I help you with Monastery360 today?",
      });
    }

    // Add user message to history
    chatHistory.push({
      role: "user",
      content: message,
    });

    // Keep history manageable (last 20 messages)
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for Monastery360, a platform for exploring sacred Buddhist monasteries in Sikkim, India. 
          You help tourists plan their visits, answer questions about monasteries, their history, culture, significance, and provide travel tips for Sikkim.
          Be friendly, informative, and enthusiastic about Sikkim's spiritual heritage.`,
        },
        ...chatHistory,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantResponse = completion.choices[0].message.content;

    // Add assistant response to history
    chatHistory.push({
      role: "assistant",
      content: assistantResponse,
    });

    res.json({
      msg: "Response generated",
      response: assistantResponse,
      chatHistory: chatHistory.slice(-5), // Return last 5 messages
    });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res.status(500).json({
      error: "Failed to get AI response",
      details: err.message,
    });
  }
};

// Trip Planner using AI
export const generateTripPlan = async (req, res) => {
  const { monasteries, days, interests = [] } = req.body;

  if (!monasteries || !days) {
    return res
      .status(400)
      .json({ msg: "Monasteries and number of days are required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(400)
      .json({ msg: "AI service not configured. Please contact admin." });
  }

  try {
    const prompt = `Create a detailed ${days}-day trip plan to visit these monasteries in Sikkim: ${monasteries.join(", ")}.
    Interests: ${interests.join(", ") || "General tourism and spirituality"}
    
    Provide:
    1. Day-by-day itinerary with timing
    2. Travel directions and transportation
    3. Best time to visit each monastery
    4. Local food recommendations
    5. Cultural tips and etiquette
    6. Budget estimates`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner specializing in Sikkim monasteries and tourism.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const tripPlan = completion.choices[0].message.content;

    res.json({
      msg: "Trip plan generated",
      tripPlan,
    });
  } catch (err) {
    console.error("Trip planner error:", err.message);
    res.status(500).json({
      error: "Failed to generate trip plan",
      details: err.message,
    });
  }
};
