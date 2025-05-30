export const RSSHubCategories = [
  "all",
  "social-media",
  "new-media",
  "traditional-media",
  "bbs",
  "blog",
  "programming",
  "design",
  "live",
  "multimedia",
  "picture",
  "anime",
  "program-update",
  "university",
  "forecast",
  "travel",
  "shopping",
  "game",
  "reading",
  "government",
  "study",
  "journal",
  "finance",
] as const

export const CategoryMap: Record<
  (typeof RSSHubCategories)[number],
  { fromColor: string; toColor: string; emoji: string }
> = {
  all: { fromColor: "#E6C07B", toColor: "#FFCA28", emoji: "⭐️" },
  "social-media": { fromColor: "#A0C4FF", toColor: "#42A5F5", emoji: "💬" },
  "new-media": { fromColor: "#FFB4A2", toColor: "#FF7043", emoji: "📣" },
  "traditional-media": { fromColor: "#C0C0C0", toColor: "#BDBDBD", emoji: "📰" },
  bbs: { fromColor: "#FFD6A5", toColor: "#FFB74D", emoji: "💭" },
  blog: { fromColor: "#CAA6E9", toColor: "#AB47BC", emoji: "✍️" },
  programming: { fromColor: "#A8E6CF", toColor: "#66BB6A", emoji: "💻" },
  design: { fromColor: "#FFB7CE", toColor: "#EC407A", emoji: "🎨" },
  live: { fromColor: "#E07A5F", toColor: "#EF5350", emoji: "📺" },
  multimedia: { fromColor: "#FFE5D4", toColor: "#FF8A65", emoji: "🎞️" },
  picture: { fromColor: "#B2DBBF", toColor: "#26A69A", emoji: "🖼️" },
  anime: { fromColor: "#FFCAD4", toColor: "#F06292", emoji: "🌸" },
  "program-update": { fromColor: "#C2CAD0", toColor: "#78909C", emoji: "🔄" },
  university: { fromColor: "#9DB4C0", toColor: "#5C6BC0", emoji: "🎓" },
  forecast: { fromColor: "#A2D2FF", toColor: "#4FC3F7", emoji: "⛅️" },
  travel: { fromColor: "#BDE0FE", toColor: "#4DD0E1", emoji: "✈️" },
  shopping: { fromColor: "#FFADAD", toColor: "#F48FB1", emoji: "🛍️" },
  game: { fromColor: "#BDB2FF", toColor: "#7E57C2", emoji: "🎮" },
  reading: { fromColor: "#DDBEA9", toColor: "#8D6E63", emoji: "📖" },
  government: { fromColor: "#C4C4C4", toColor: "#90A4AE", emoji: "🏛️" },
  study: { fromColor: "#FFE5A0", toColor: "#FFD54F", emoji: "📚" },
  journal: { fromColor: "#D9BF77", toColor: "#A1887F", emoji: "📓" },
  finance: { fromColor: "#A8C686", toColor: "#81C784", emoji: "💰" },
}
