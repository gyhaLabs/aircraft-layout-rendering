import ReactDOMServer from "react-dom/server";
import { ReactComponent as Plane } from "./plane.svg";
import { ReactComponent as Box } from "./box.svg";
import { ReactComponent as BoxHovered } from "./box-hovered.svg";
import { ReactComponent as BoxError } from "./box-error.svg";
import { ReactComponent as BoxErrorHovered } from "./box-error-hovered.svg";
import useImage from "use-image";

const useImages = () => {
  const [background] = useImage(
    `data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<Plane />)
    )}`
  );
  const [box] = useImage(
    `data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<Box />)
    )}`
  );
  const [boxHovered] = useImage(
    `data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<BoxHovered />)
    )}`
  );
  const [boxError] = useImage(
    `data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<BoxError />)
    )}`
  );
  const [boxErrorHovered] = useImage(
    `data:image/svg+xml,${encodeURIComponent(
      ReactDOMServer.renderToStaticMarkup(<BoxErrorHovered />)
    )}`
  );
  return { box, boxHovered, boxError, boxErrorHovered, background };
};

export default useImages;
