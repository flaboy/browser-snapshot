export function snapshotScript(): string {
  return `(() => {
    const out = [];
    document.querySelectorAll('a,button,input,textarea,select,area,summary,[role],[tabindex]').forEach((el) => {
      out.push({ selector: '', group: '', role: '', name: '', text: '', tagName: el.tagName.toLowerCase(), href: '', value: '', placeholder: '', textLength: 0 });
    });
    return out;
  })()`
}
