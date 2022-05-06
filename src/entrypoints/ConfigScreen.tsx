import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Button, Canvas, TextField, Form, FieldGroup } from "datocms-react-ui";
import { Form as FormHandler, Field } from "react-final-form";

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

export type ValidGlobalParams = {
  cloudName: string;
  publicApiKey: string;
};

const validate = (value: string) => {
  if (!value) {
    return "is required!";
  }
};

export default function ConfigScreen({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <FormHandler<ValidGlobalParams>
        initialValues={
          ctx.plugin.attributes.parameters.cloudName
            ? ctx.plugin.attributes.parameters
            : {
                cloudName: "",
                publicApiKey: "",
              }
        }
        validate={(values: ValidGlobalParams) => {
          return {
            cloudName: validate(values.cloudName),
            publicApiKey: validate(values.publicApiKey),
          };
        }}
        onSubmit={async (values: ValidGlobalParams) => {
          await ctx.updatePluginParameters(values);
          ctx.notice("Settings updated successfully!");
        }}
      >
        {({ handleSubmit, submitting, dirty }) => (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field name="cloudName">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="cloudName"
                    label="Cloudinary cloud name"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
              <Field name="publicApiKey">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="publicApiKey"
                    label="Cloudinary public api key"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={submitting || !dirty}
            >
              Save settings
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}
