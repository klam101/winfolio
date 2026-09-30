// Renders text with **bold** segments (used by the resume data)
function Rich({ text }: { text: string }) {
  return text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

export default Rich
