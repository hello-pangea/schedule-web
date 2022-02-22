import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { createEvent } from "api/api";
import DateTable from "components/DateTable";
import Page from "components/layout/Page";
import { addHours, format, getUnixTime, startOfToday } from "date-fns";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from "yup";

const ValidationSchema = Yup.object().shape({
  name: Yup.string().max(80, "Too Long!").required("Required"),
});

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [days, setDays] = useState<number[]>([]);

  function updateData(data: number[]) {
    console.log("update");

    setDays(data);
  }

  return (
    <Page>
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Typography variant="h1" sx={{ mb: 4 }}>
          Plan an event
        </Typography>
        <Formik
          initialValues={{
            name: "",
            minTime: 9,
            maxTime: 17,
          }}
          validationSchema={ValidationSchema}
          onSubmit={(values) => {
            createEvent({
              name: values.name,
              minTime: getUnixTime(addHours(startOfToday(), values.minTime)),
              maxTime: getUnixTime(addHours(startOfToday(), values.maxTime)),
              days: days,
            })
              .then((data) => {
                router.push("/events/" + data.id);
              })
              .catch(() => {
                setIsErrorOpen(true);
              });
          }}
        >
          {({
            submitForm,
            isSubmitting,
            values,
            handleChange,
            touched,
            errors,
          }) => (
            <Form>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Event Name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    variant="filled"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Earliest time</InputLabel>
                    <Select
                      value={values.minTime}
                      onChange={handleChange}
                      name="minTime"
                    >
                      {[...Array(24)].map((value, i) => {
                        return (
                          <MenuItem key={i} value={i}>
                            {format(addHours(startOfToday(), i), "hh:mm aaa")}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Latest time</InputLabel>
                    <Select
                      value={values.maxTime}
                      onChange={handleChange}
                      name="maxTime"
                    >
                      {[...Array(24)].map((value, i) => {
                        return (
                          <MenuItem key={i} value={i}>
                            {format(addHours(startOfToday(), i), "hh:mm aaa")}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
                    Select some dates that might work
                  </Typography>
                  <DateTable startDate={new Date()} onChange={updateData} />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <LoadingButton
                    color="primary"
                    variant="contained"
                    onClick={submitForm}
                    loading={isSubmitting}
                  >
                    Create Event
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={isErrorOpen}
          onClose={() => {
            setIsErrorOpen(false);
          }}
          autoHideDuration={6000}
        >
          <Alert
            onClose={() => {
              setIsErrorOpen(false);
            }}
            severity="error"
          >
            Error creating event
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
