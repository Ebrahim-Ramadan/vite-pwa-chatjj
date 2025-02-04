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

