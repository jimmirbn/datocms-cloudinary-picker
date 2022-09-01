import { Canvas, Button } from "datocms-react-ui";
import get from "lodash.get";
import type { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import type { Media } from "./CloudinaryPicker";

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
  label: string;
};

export interface FieldImage extends Media {
  caption?: string;
}

export function FocalPointPickerButton({ ctx, label }: PropTypes) {
  const handleOpenModal = async () => {
    const currentValue = JSON.parse(
      get(ctx.formValues, ctx.fieldPath)
    ) as FieldImage;

    const modalResult = await ctx.openModal({
      id: "focalPointPickerModal",
      width: 1280,
      parameters: {
        image: currentValue,
      },
    });

    const updatedImageItem = {
      ...currentValue,
      ...{
        focalPoint: modalResult,
      },
    };
    await ctx.setFieldValue(ctx.fieldPath, JSON.stringify(updatedImageItem));
  };

  return (
    <Canvas ctx={ctx}>
      <Button
        style={{ marginLeft: -10 }}
        type="button"
        onClick={handleOpenModal}
      >
        {label}
      </Button>
    </Canvas>
  );
}
