import { examples } from "./examples-config";

let wrapper;

const createExampleEntry = ({ name, preview }) => {
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

  wrapper.appendChild(exampleWrapper);
};

export const createExamples = () => {
  wrapper = document.querySelector(".left-panel");

  examples.forEach(createExampleEntry);
};
