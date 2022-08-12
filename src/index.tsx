import {
  connect,
  OnBootCtx,
  RenderFieldExtensionCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  RenderModalCtx,
} from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import { Image, Video, Placeholder } from "cloudinary-react";
import { render } from "./utils/render";
import "datocms-react-ui/styles.css";
import FieldConfigScreen from "./entrypoints/FieldConfigScreen";

import ConfigScreen from "./entrypoints/ConfigScreen";
import { CloudinaryPicker } from "./components/CloudinaryPicker";
import {
  CloudinaryPickerButton,
  FieldImage,
} from "./components/CloudinaryPickerButton";
import get from "lodash.get";
// import { FocalPointPicker } from "./components/FocalPointPicker";
// import { FocalPointPickerButton } from "./components/FocalPointPickerButton";

const FIELD_EXTENSION_ID = "cloudinaryPicker";
const INITIAL_HEIGHT = 80;

connect({
  async onBoot(ctx: OnBootCtx) {
    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }
  },
  renderConfigScreen(ctx) {
    render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions() {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: "Cloudinary picker",
        type: "editor",
        fieldTypes: ["json"],
        configurable: true,
        initialHeight: INITIAL_HEIGHT,
      },
    ];
  },
  overrideFieldExtensions(field) {
    if (
      field.attributes.field_type !== "json" ||
      field.attributes.appearance.field_extension !== FIELD_EXTENSION_ID
    ) {
      return;
    }

    return {
      editor: {
        id: FIELD_EXTENSION_ID,
        initialHeight: INITIAL_HEIGHT,
      },
    };
  },
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    render(<FieldConfigScreen ctx={ctx} />);
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      const currentValue = JSON.parse(
        get(ctx.formValues, ctx.fieldPath)
      ) as FieldImage;

      if (currentValue && (currentValue.public_id || currentValue.id)) {
        const publicId = currentValue.public_id || currentValue.id;
        if (currentValue.duration) {
          return render(
            <Canvas ctx={ctx}>
              <Video
                cloudName={ctx.plugin.attributes.parameters.cloudName}
                publicId={publicId}
                width="auto"
                controls
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "500px",
                  cursor: "pointer",
                }}
              />
              {currentValue.alt ? <p>Alt text: {currentValue.alt}</p> : null}
              <div style={{ display: "flex" }}>
                <CloudinaryPickerButton label="Pick new asset" ctx={ctx} />
              </div>
            </Canvas>
          );
        } else {
          return render(
            <Canvas ctx={ctx}>
              <Image
                cloudName={ctx.plugin.attributes.parameters.cloudName}
                publicId={publicId}
                height="500"
              >
                {/* {currentValue.focalPoint ? (
                  <Transformation
                    gravity="xy_center"
                    height="500"
                    x={currentValue.focalPoint.x}
                    y={currentValue.focalPoint.y}
                    crop="crop"
                  />
                ) : null} */}
                <Placeholder />
              </Image>
              {currentValue.alt ? <p>Alt text: {currentValue.alt}</p> : null}
              <div style={{ display: "flex" }}>
                <CloudinaryPickerButton label="Pick new asset" ctx={ctx} />
                {/* <FocalPointPickerButton label="Set focal point" ctx={ctx} />
                {currentValue.focalPoint ? (
                  <Canvas ctx={ctx}>
                    <Button
                      onClick={async () => {
                        delete currentValue["focalPoint"];

                        await ctx.setFieldValue(
                          ctx.fieldPath,
                          JSON.stringify(currentValue)
                        );
                      }}
                    >
                      Remove focal point
                    </Button>
                  </Canvas>
                ) : null} */}
              </div>
            </Canvas>
          );
        }
      }

      return render(
        <CloudinaryPickerButton label="Choose cloudinary asset" ctx={ctx} />
      );
    }
  },
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case "cloudinaryPickerModal":
        return render(<CloudinaryPicker ctx={ctx} />);
      // case "focalPointPickerModal":
      //   return render(<FocalPointPicker ctx={ctx} />);
    }
  },
});
