import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { Paper } from '@material-ui/core';
import { InfoWindow, Map, Marker } from 'google-maps-react';


function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };
const mapStyle = {
  width: '50vw',
  height: '75vh',
  'marginLeft': 'auto',
  'marginRight': 'auto'
}
const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

export default function GoogleMaps() {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyCmJSyYBwpiUzpWCSsOx9ZdDetRO3m8Xbs&libraries=places",
        document.querySelector("head"),
        "google-maps",
      );
    }

    loaded.current = true;
  }

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      throttle((input, callback) => {
        autocompleteService.current.getPlacePredictions(input, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    fetch({ input: inputValue }, results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      style={{ width: 300 }}
      getOptionLabel={option =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={x => x}
      options={options}
      autoComplete
      includeInputInList
      freeSolo
      renderInput={params => (
        <TextField
          {...params}
          label="Add a location"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={option => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map(match => [match.offset, match.offset + match.length])
        );

        return (
          <div>
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>

            <Map
              item
              xs={12}
              style={mapStyle}
              google={this.props.google}
              onClick={this.onMapClick}
              zoom={14}
              initialCenter={{ lat: loaded.lat, lng: loaded.lng }}
            >
              <Marker
                onClick={this.onMarkerClick}
                title={'Google Map AutoComplete'}
                position={{ lat: loaded.lat, lng: loaded.lng }}
                name={'Google Map AutoComplete'}
              />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
              >
                <Paper>
                  <Typography
                    variant='headline'
                    component='h4'
                  >
                    Google Map AutoComplete
                  </Typography>

                </Paper>
              </InfoWindow>
            </Map>

          </div>
        );
      }}
    />
  );
}

