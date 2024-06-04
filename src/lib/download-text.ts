export function downloadText(text: string) {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(text);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'DomoDatasetTesting.yml';
  hiddenElement.click();
}
