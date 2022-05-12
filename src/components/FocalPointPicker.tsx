import { Button, Canvas } from "datocms-react-ui";
import { Image, Placeholder } from "cloudinary-react";

import type { RenderModalCtx } from "datocms-plugin-sdk";
import { FieldImage } from "./CloudinaryPickerButton";
import { FocusPicker, Focus } from "image-focus";
import { useEffect, useRef, useState } from "react";

type PropTypes = {
  ctx: RenderModalCtx;
};

const minimumXCoords = -1.0;
const maximumXCoords = 1.0;

export function FocalPointPicker({ ctx }: PropTypes) {
  const currentValue = ctx.parameters.image as unknown as FieldImage;
  const { height, width } = currentValue;

  const cloudinaryImageRef = useRef<{
    element?: {
      current?: HTMLImageElement;
    };
  }>(null);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const FocusPickerRef = useRef<FocusPicker | undefined>(undefined);

  useEffect(() => {
    const imageElement = cloudinaryImageRef.current?.element?.current;

    if (imageElement && !FocusPickerRef.current) {
      const focus: Focus = { x: 0, y: 0 };

      FocusPickerRef.current = new FocusPicker(imageElement, {
        focus,
        onChange: (newFocus: Focus) => {
          const x = newFocus.x.toFixed(2);
          const y = newFocus.y.toFixed(2);

          const xPercent =
            ((parseFloat(x) - minimumXCoords) * 100) /
            (maximumXCoords - minimumXCoords);

          const yPercent =
            ((parseFloat(y) - maximumXCoords) * 100) /
            (minimumXCoords - maximumXCoords);

          const xCoords = (xPercent / 100) * width;
          const YCoords = (yPercent / 100) * height;

          const coords = {
            x: Math.round(xCoords),
            y: Math.round(YCoords) === -0 ? 0 : Math.round(YCoords),
          };

          setCoords(coords);
        },
      });
    }
  }, [height, width]);

  const saveAndCloseModal = async () => {
    ctx.resolve(coords);
  };

  return (
    <Canvas ctx={ctx}>
      <div
        style={{
          height: "850px",
        }}
      >
        <div style={{ height: 780 }}>
          <Image
            ref={cloudinaryImageRef}
            cloudName={ctx.plugin.attributes.parameters.cloudName}
            publicId={currentValue.public_id}
            height="780"
            crop="scale"
            style={{
              objectFit: "cover",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <Placeholder />
          </Image>
        </div>
        <Button
          style={{ marginTop: 24 }}
          type="button"
          onClick={saveAndCloseModal}
        >
          Save
        </Button>
      </div>
    </Canvas>
  );
}
