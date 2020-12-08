const a = ["A", "B", "C", "D"];

if (a[0] == "") {
  const text = Object.keys(a).map((key) => a[key]).join(', ');
  console.log(text.substring(0, text.length - 6));
} else if (a[1] == "") {
  const text = Object.keys(a).map((key) => a[key]).join(', ');
  console.log(text.substring(0, text.length - 6));
} else if (a[2] == "") {
  const text = Object.keys(a).map((key) => a[key]).join(', ');
  console.log(text.substring(0, text.length - 4));
} else if (a[3] == "") {
  const text = Object.keys(a).map((key) => a[key]).join(', ');
  console.log(text.substring(0, text.length - 2));
} else {
  const text = Object.keys(a).map((key) => a[key]).join(', ');
  console.log(text);
}
