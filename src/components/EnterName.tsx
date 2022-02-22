import { Box, Button, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";

type Props = {
  setName: (newName: string) => void;
};

export default function EnterName({ setName }: Props) {
  return (
    <Box display="flex" justifyContent="center" height="100%">
      <Formik
        initialValues={{
          name: "",
        }}
        onSubmit={(values) => {
          setName(values.name);
        }}
      >
        {({ submitForm, isSubmitting, values, handleChange }) => (
          <Form>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <TextField
                name="name"
                label="Your name"
                helperText="Enter your name to set your availability"
                type="text"
                value={values.name}
                onChange={handleChange}
                variant="filled"
              />
              <Button
                color="primary"
                variant="contained"
                onClick={submitForm}
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
