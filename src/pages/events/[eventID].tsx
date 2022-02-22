import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Hidden,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { getEvent, updateFreeTime } from "api/api";
import AvailabilityTable from "components/AvailabilityTable";
import EnterName from "components/EnterName";
import Page from "components/layout/Page";
import TimeTable from "components/TimeTable";
import { fromUnixTime } from "date-fns";
import Event from "interfaces/event";
import TimeInterval from "interfaces/timeInterval";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function EventPage(): JSX.Element {
  const router = useRouter();
  const [event, setEvent] = useState<Event>();
  const [name, setName] = useState<string | undefined>();
  const [freeTime, setFreeTime] = useState<TimeInterval[] | undefined>();
  const [showingAllAvailability, setShowingAllAvailability] = useState(false);
  const [day, setDay] = useState("");
  const [available, setAvailable] = useState([""]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => {
    if (router.query.eventID) {
      getEvent(router.query.eventID as string).then((fetchedEvent) => {
        if (name !== undefined) {
          setFreeTime(
            fetchedEvent.people?.filter((personData) => {
              return personData.name === name;
            })[0]?.freeTime
          );
        }

        setEvent(fetchedEvent);
      });
    }
  }, [router.query.eventID, name]);

  function updateData(data: TimeInterval[]) {
    if (!event || !name) {
      return;
    }
    updateFreeTime({ eventId: event.id, name: name, freeTime: data });
  }

  function updateAllAvailability(day: string, available: string[]) {
    setDay(day);
    setAvailable(available);
  }

  function showPersonalAvailability() {
    setShowingAllAvailability(false);
  }

  function showAllAvailability() {
    setShowingAllAvailability(true);
  }

  function copyLink() {
    if (!event) {
      return;
    }

    navigator.clipboard
      .writeText("https://schedule.hellopangea.com/events/" + event.id)
      .then(
        function () {
          /* clipboard successfully set */
          setIsSuccessOpen(true);
        },
        function () {
          /* clipboard write failed */
          setIsErrorOpen(true);
        }
      );
  }

  if (!event) {
    return (
      <Page>
        <CircularProgress />
      </Page>
    );
  }

  return (
    <Page seoTitle={event.name}>
      <Container maxWidth="lg" sx={{ p: 2 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          {event.name}
        </Typography>
        <Hidden smDown>
          <Card variant="outlined" sx={{ p: 1, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <IconButton aria-label="copy" size="medium" onClick={copyLink}>
                  <SaveRoundedIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1">Share link</Typography>
                <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                  https://schedule.hellopangea.com/events/{event.id}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Hidden>
        <Box sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              {showingAllAvailability === false ? (
                <>
                  {name === undefined ? (
                    <EnterName setName={setName} />
                  ) : (
                    <>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        Your availability
                      </Typography>
                      <TimeTable
                        minTime={fromUnixTime(event.minTime)}
                        maxTime={fromUnixTime(event.maxTime)}
                        days={event.days}
                        data={freeTime ?? []}
                        onChange={updateData}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {day}
                  </Typography>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="h3" sx={{ mb: 2 }}>
                        Available
                      </Typography>
                      <Typography variant="body1" component="ul">
                        {available.map((name, key) => (
                          <li key={key}>{name}</li>
                        ))}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {/* <Typography variant="h3" sx={{ mb: 2 }}>
                          Not available
                        </Typography> */}
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Group&apos;s availability
              </Typography>
              <AvailabilityTable
                minTime={fromUnixTime(event.minTime)}
                maxTime={fromUnixTime(event.maxTime)}
                days={event.days}
                people={event.people ?? []}
                onMouseEnter={showAllAvailability}
                onMouseLeave={showPersonalAvailability}
                onChange={updateAllAvailability}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Snackbar
        open={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
        }}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => {
            setIsSuccessOpen(false);
          }}
          severity="success"
        >
          Copied link
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        onClose={() => {
          setIsErrorOpen(false);
        }}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => {
            setIsErrorOpen(false);
          }}
          severity="error"
        >
          Issue copying link
        </Alert>
      </Snackbar>
    </Page>
  );
}
