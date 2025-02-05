export const streamChat = async (userPrompt: string, onChunkReceived: (chunk: string) => void): Promise<string> => {
  if (!userPrompt) {
    throw new Error("No prompt provided")
  }

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        messages: [{ role: "user", content: userPrompt }],
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Failed to get reader from response")
    }

    const decoder = new TextDecoder()
    let accumulatedResponse = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      try {
        const parsedChunk = JSON.parse(chunk)
        const content = parsedChunk.message?.content || ""

        if (content) {
          accumulatedResponse += content
          onChunkReceived(content)
        }
      } catch (e) {
        console.error("Error parsing chunk:", e)
        continue
      }
    }

    return accumulatedResponse
  } catch (error) {
    console.error("Error streaming chat:", error)
    throw error
  }
}

export const generateChatName = async ({ chat }: { chat: string }) => {
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b',
        messages: [
          {
            role: 'user',
            content: `Summarize '${chat}' in exactly 3 words. (do not think)`,
          },
        ],
      }),
    });

    // Check if the response is okay
    if (!response.ok) {
      const errorText = await response.text(); // Get the raw response text
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    // Get the raw response text for debugging
    const rawText = await response.text();
    console.log('Raw response text:', rawText);

    // Split the response by newlines and parse each JSON object
    const jsonObjects = rawText.trim().split('\n').map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.error('Error parsing JSON:', e, 'Line:', line);
        return null; // Return null for any invalid JSON
      }
    }).filter(obj => obj !== null); // Filter out any null values

    // Process the parsed JSON objects
    const messages = jsonObjects.map(obj => obj.message.content).join(' '); // Join all messages
    console.log('Combined messages:', messages);

    return messages
      .replace(/<think>.*?<\/think>/s, '')
      .trim()
      .replace(/[^\w\s]/g, '')
      .split(',')[0]
      .replace(/[^\w\s]/g, '');
  } catch (error) {
    console.error('Error generating chat name:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
