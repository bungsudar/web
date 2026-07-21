const LABELS = {
  note: '注意',
  info: '信息',
  tip: '提示',
  warning: '警告',
  danger: '危险',
};

function textValue(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textValue).join('');
}

export default function remarkAdmonitions() {
  return (tree) => {
    const visit = (node) => {
      if (!Array.isArray(node.children)) return;

      for (const child of node.children) {
        if (child.type === 'blockquote' && child.children?.[0]?.type === 'paragraph') {
          const marker = textValue(child.children[0]).match(/^\[!([A-Z]+)\](?:\s+(.+))?/i);
          if (marker) {
            const type = marker[1].toLowerCase();
            const title = marker[2]?.trim() || LABELS[type] || LABELS.note;
            const paragraph = child.children[0];
            const firstText = paragraph.children.find((item) => item.type === 'text');

            if (firstText) {
              firstText.value = firstText.value.replace(/^\[![A-Z]+\](?:\s+.+)?/i, '').trimStart();
            }
            if (!textValue(paragraph).trim()) child.children.shift();

            child.data = {
              ...(child.data || {}),
              hName: 'aside',
              hProperties: {
                className: ['admonition', `admonition-${type}`],
                dataAdmonition: type,
                dataTitle: title,
              },
            };
          }
        }
        visit(child);
      }
    };

    visit(tree);
  };
}
