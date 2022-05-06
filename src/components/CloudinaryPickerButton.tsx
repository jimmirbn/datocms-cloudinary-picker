import { Canvas, Button } from "datocms-react-ui";
import type { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import type { Media } from "./CloudinaryPicker";
import { getLanguageFromLocale } from "../utils/getLanguageFromLocale";

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
  label: string;
};

export interface FieldImage extends Media {
  caption?: string;
  alt?: string;
}

export function CloudinaryPickerButton({ ctx, label }: PropTypes) {
  const language = getLanguageFromLocale(ctx.locale);

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
        height: item.height,
        metadata: item.metadata,
        public_id: item.public_id,
        resource_type: item.resource_type,
        secure_url: item.secure_url,
        tags: item.tags,
        type: item.type,
        uploaded_by: item.uploaded_by,
        url: item.url,
        version: item.version,
        width: item.width,
      };

      if (item.context && item.context.custom) {
        const customMetaData = item.context.custom as {
          [key: string]: string;
        };

        const { alt, caption } = customMetaData;

        if (caption) {
          imageItem.caption = caption;
        }

        if (alt) {
          imageItem.alt = alt;
        }

        if (customMetaData[language]) {
          imageItem.alt = customMetaData[language];
        }
      }

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
