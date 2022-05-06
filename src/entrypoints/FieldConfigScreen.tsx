import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, SwitchField } from "datocms-react-ui";
import { useCallback, useState } from "react";

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export type ValidConfigFieldParams = {
  useAsCloudinaryPicker: boolean;
};

const FieldConfigScreen = ({ ctx }: PropTypes) => {
  const [formValues, setFormValues] = useState<ValidConfigFieldParams>(
    ctx.parameters as ValidConfigFieldParams
  );

  const update = useCallback(
    (field, value) => {
      const newParameters = { ...formValues, [field]: value };
      setFormValues(newParameters);
      ctx.setParameters(newParameters);
    },
    [formValues, setFormValues, ctx]
  );

  return (
    <Canvas ctx={ctx}>
      <SwitchField
        id="useAsCloudinaryPicker"
        name="useAsCloudinaryPicker"
        label="use as Cloudinary picker"
        value={formValues.useAsCloudinaryPicker === null}
        onChange={(checked) =>
          update("useAsCloudinaryPicker", checked ? null : false)
        }
      />
    </Canvas>
  );
};

export default FieldConfigScreen;
