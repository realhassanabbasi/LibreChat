/**
 * Curated registry of model capabilities, shown as badges in the model
 * selector so users can see what a model supports *before* selecting it.
 *
 * Pattern-based: model IDs vary by provider and deployment (OpenAI, Azure,
 * custom endpoints), so capabilities are matched by well-known model family
 * patterns rather than exact IDs. First match wins — order specific patterns
 * before general ones.
 *
 * This is intentionally conservative: a model is only listed as capable when
 * its family is widely known to support the capability. Unknown models show
 * no badges rather than wrong ones.
 */

export type ModelCapability = 'vision' | 'tools' | 'code';

interface CapabilityRule {
  pattern: RegExp;
  capabilities: ModelCapability[];
}

const CAPABILITY_RULES: CapabilityRule[] = [
  // OpenAI — GPT-4o family: vision, function calling, code execution
  { pattern: /gpt-4o/i, capabilities: ['vision', 'tools', 'code'] },
  // GPT-4 Turbo: vision + tools
  { pattern: /gpt-4-turbo|gpt-4-vision/i, capabilities: ['vision', 'tools'] },
  // Base GPT-4: tools only
  { pattern: /gpt-4/i, capabilities: ['tools'] },
  // o-series reasoning models: vision + tools
  { pattern: /\bo[134](-mini)?\b/i, capabilities: ['vision', 'tools'] },
  // GPT-3.5: tools only
  { pattern: /gpt-3\.5/i, capabilities: ['tools'] },
  // Anthropic Claude: vision, tools, code execution across Claude 3+
  { pattern: /claude/i, capabilities: ['vision', 'tools', 'code'] },
  // Google Gemini: vision, tools, code execution
  { pattern: /gemini/i, capabilities: ['vision', 'tools', 'code'] },
  // Google Gemma: tools on recent versions
  { pattern: /gemma/i, capabilities: ['tools'] },
  // Meta Llama: tool calling on Llama 3+
  { pattern: /llama-?3/i, capabilities: ['vision', 'tools'] },
  { pattern: /llama/i, capabilities: ['tools'] },
  // Mistral: tool calling across the family
  { pattern: /mistral|mixtral/i, capabilities: ['vision', 'tools'] },
  // DeepSeek: tools on chat models, code on coder models
  { pattern: /deepseek-coder/i, capabilities: ['tools', 'code'] },
  { pattern: /deepseek/i, capabilities: ['tools'] },
  // Qwen: vision on VL models, tools broadly
  { pattern: /qwen.*-vl|qwen-vl/i, capabilities: ['vision', 'tools'] },
  { pattern: /qwen/i, capabilities: ['tools'] },
  // xAI Grok: vision + tools
  { pattern: /grok/i, capabilities: ['vision', 'tools'] },
];

/**
 * Returns the known capabilities for a model ID, or an empty array when the
 * model isn't in the curated registry. Never guesses — unknown models show
 * no badges.
 */
export function getModelCapabilities(modelId: string | null | undefined): ModelCapability[] {
  if (!modelId) {
    return [];
  }
  for (const rule of CAPABILITY_RULES) {
    if (rule.pattern.test(modelId)) {
      return rule.capabilities;
    }
  }
  return [];
}
