export function scoreShare(shifts, perfects, url) {
  const text = `I banked ${shifts * 8} hours across ${shifts} shifts with ${perfects} perfect drops in Clock Stack by WorkEasy Software. Can you beat my stack?`;
  return {
    title: 'My Clock Stack score', text, url,
    copy: `${text}\n${url}`,
    x: `https://twitter.com/intent/tweet?${new URLSearchParams({ text, url })}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`,
  };
}
