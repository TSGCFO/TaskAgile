const programmingJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "How many programmers does it take to change a light bulb? None. That's a hardware problem.",
  "Why don't programmers like nature? It has too many bugs.",
  "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why did the programmer quit his job? He didn't get arrays.",
  "What's the object-oriented way to become wealthy? Inheritance.",
  "Why do Java developers wear glasses? Because they can't C#.",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache.",
  "What do you call a programmer from Finland? Nerdic.",
];

export async function GET() {
  try {
    const randomJoke = programmingJokes[Math.floor(Math.random() * programmingJokes.length)];
    
    return Response.json({
      joke: randomJoke,
      category: "programming",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Joke API error:", error);
    return Response.json({ error: "Failed to get joke" }, { status: 500 });
  }
}
