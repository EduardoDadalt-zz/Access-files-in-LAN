fetch("/", {
  method: "POST",
  body: JSON.stringify({ type: "index", e: "C:\\", l: location.pathname }),
  headers: { "Content-type": "application/json" },
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    data.forEach((f) => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = location.href + '"' + f + '"' + "/";
      a.innerText = f;
      li.appendChild(a);
      document.querySelector("ul").appendChild(li);
    });
  });
