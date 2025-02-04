const STREAM_DELAY = 50 // ms between chunks
const STREAM_CHUNKS = [
  "Hello! I'm an AI assistant. ",
  "How can I help you today? ",
  "I can provide information, ",
  "answer questions, ",
  "or assist with various tasks. ",
  "What would you like to know?",
]

export async function simulateStream(messageId: string, onChunk: (chunk: string) => void): Promise<void> {
  for (const chunk of STREAM_CHUNKS) {
    await new Promise((resolve) => setTimeout(resolve, STREAM_DELAY))
    onChunk(chunk)
  }
}

