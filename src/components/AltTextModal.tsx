import { Button, Canvas, FieldGroup, Form, TextField } from "datocms-react-ui";

import type { RenderModalCtx } from "datocms-plugin-sdk";
import { Form as FormHandler, Field } from "react-final-form";
import { Media } from "./CloudinaryPicker";

type PropTypes = {
  ctx: RenderModalCtx;
};

export function AltText({ ctx }: PropTypes) {
  const item = ctx.parameters.item as Media;
  const locale = ctx.parameters.locale as string;

  const initialValues = item.alt ? item.alt : { [locale]: "" };

  return (
    <Canvas ctx={ctx}>
      <FormHandler
        initialValues={initialValues}
        onSubmit={async (values) => {
          ctx.resolve(values);
        }}
      >
        {({ handleSubmit, submitting, dirty }) => (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field name={locale}>
                {({ input, meta: { error } }) => (
                  <TextField
                    id={locale}
                    label={locale}
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
              Save alt texts
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}
