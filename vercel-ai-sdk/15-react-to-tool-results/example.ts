export const step = [
  {
    stepType: "initial",
    text: "I'll help you check the current weather in London right away.",
    toolCalls: [
      {
        type: "tool-call",
        toolCallId: "toolu_011n3T6TJnwZLyR4G8h1ZcMz",
        toolName: "getWeather",
        args: { city: "London" },
      },
    ],
    toolResults: [
      {
        type: "tool-result",
        toolCallId: "toolu_011n3T6TJnwZLyR4G8h1ZcMz",
        toolName: "getWeather",
        args: { city: "London" },
        result:
          "The weather in London is 25°C and sunny.",
      },
    ],
    finishReason: "tool-calls",
    usage: {
      promptTokens: 373,
      completionTokens: 67,
      totalTokens: 440,
    },
    request: {},
    isContinued: false,
  },
];
