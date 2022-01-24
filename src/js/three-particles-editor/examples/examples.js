import { examples } from "./examples-config";

let wrapper;

const createExampleEntry = ({ name, preview, config, load }) => {
  const exampleWrapper = document.createElement("div");
  exampleWrapper.className = "example";

  const image = document.createElement("img");
  image.className = "example-image";
  image.src = preview;
  exampleWrapper.appendChild(image);

  const title = document.createElement("div");
  title.className = "example-title";
  title.innerHTML = name;
  exampleWrapper.appendChild(title);

  exampleWrapper.onclick = () => load(JSON.parse(config));

  wrapper.appendChild(exampleWrapper);
};

export const createExamples = (load) => {
  wrapper = document.querySelector("#example-list");
  examples.forEach((example) => createExampleEntry({ ...example, load }));

  const showHideButton = document.querySelector("#show-hide-button");
  showHideButton.onclick = () =>
    (wrapper.style.display =
      wrapper.style.display === "none" ? "block" : "none");
};
