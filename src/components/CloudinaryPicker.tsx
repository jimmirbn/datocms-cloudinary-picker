import { useLayoutEffect, useRef } from "react";
import { Canvas } from "datocms-react-ui";
import type { RenderModalCtx } from "datocms-plugin-sdk";

type PropTypes = {
  ctx: RenderModalCtx;
};

export type Media = {
  public_id: string;
  id: string;
  resource_type: string;
  secure_url?: string;
  width: number;
  height: number;
  created_at?: Date;
  bytes?: number;
  tags: string[];
  created_by?: string | null;
  duration: number | null;
  format: string;
  metadata?: string[];
  type: string;
  uploaded_by?: string;
  url?: string;
  version?: number;
  context?: {
    custom?: unknown;
  };
};

export function CloudinaryPicker({ ctx }: PropTypes) {
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      widgetContainerRef &&
      widgetContainerRef.current &&
      widgetContainerRef.current.children.length === 0
    ) {
      const { cloudName, publicApiKey } = ctx.plugin.attributes.parameters;

      // @ts-expect-error
      const mediaLibrary = window.cloudinary.createMediaLibrary(
        {
          cloud_name: cloudName,
          api_key: publicApiKey,
          previous_credentials: {
            cloudName: cloudName,
            apiKey: publicApiKey,
          },
          remove_header: false,
          max_files: 1,
          multiple: false,
          insert_caption: "Add & close",
          inline_container: "#cloudinary_dialog",
          default_transformations: [
            [{ quality: "auto" }, { fetch_format: "auto" }],
            [
              {
                width: 80,
                height: 80,
                crop: "fill",
                gravity: "auto",
                radius: "max",
              },
              { fetch_format: "auto", quality: "auto" },
            ],
          ],
          integration: {
            type: "datocms_cloudinary_extension",
            platform: "datocms",
            version: 1.0,
            environment: "prod",
          },
        },
        {
          insertHandler: function (data: { assets: Media[] }) {
            if (data) {
              ctx.resolve(data);
            }
          },
        }
      );
      mediaLibrary.show();
    }
  }, [ctx]);

  return (
    <Canvas ctx={ctx}>
      <div
        ref={widgetContainerRef}
        id="cloudinary_dialog"
        style={{
          height: "800px",
        }}
      />
    </Canvas>
  );
}
