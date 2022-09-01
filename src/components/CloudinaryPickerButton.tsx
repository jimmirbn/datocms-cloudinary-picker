import { Canvas, Button } from "datocms-react-ui";
import type { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import type { Media } from "./CloudinaryPicker";

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
  label: string;
};

export interface FieldImage extends Media {
  caption?: string;
  focalPoint?: {
    x: string;
    y: string;
  };
}

export function CloudinaryPickerButton({ ctx, label }: PropTypes) {
  const handleOpenModal = async () => {
    const modalResult = (await ctx.openModal({
      id: "cloudinaryPickerModal",
      width: 1280,
    })) as unknown as { assets: Media[] };

    if (modalResult && modalResult.assets) {
      const item = modalResult.assets[0];

      const imageItem: FieldImage = {
        bytes: item.bytes,
        created_at: item.created_at,
        created_by: item.created_by,
        duration: item.duration,
        format: item.format,
        width: item.width,
        height: item.height,
        metadata: item.metadata,
        public_id: item.public_id,
        id: item.public_id,
        resource_type: item.resource_type,
        secure_url: item.secure_url,
        tags: item.tags,
        type: item.type,
        uploaded_by: item.uploaded_by,
        url: item.url,
        version: item.version,
      };

      await ctx.setFieldValue(ctx.fieldPath, JSON.stringify(imageItem));
    }
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
