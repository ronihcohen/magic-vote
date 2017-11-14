import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { map } from "lodash";
import Theme from "theme";
import NewOptionPanel from "../components/NewOptionPanel";
import OptionItem from "../components/OptionItem";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS // needed for full list and once
  // orderedToJS, // needed for ordered list
  // populatedDataToJS // needed for populated list
} from "react-redux-firebase";
import CircularProgress from "material-ui/CircularProgress";
import Snackbar from "material-ui/Snackbar";
import { List } from "material-ui/List";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import classes from "./OptionsContainer.scss";

// const populates = [{ child: 'owner', root: 'users', keyProp: 'uid' }]

@firebaseConnect([
  { path: "options", queryParams: ["orderByKey"] },
  { path: "optionsNumber" },
  { path: "imgUrl" }
  // { path: 'todos', type: 'once' } // for loading once instead of binding
  // { path: "options", queryParams: ["orderByKey", "limitToLast=5"] } // 10 most recent
  // { path: 'todos', populates } // populate
  // { path: 'todos', storeAs: 'myTodos' } // store elsewhere in redux
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, "auth"),
  account: pathToJS(firebase, "profile"),
  options: dataToJS(firebase, "options"),
  optionsNumber: dataToJS(firebase, "optionsNumber"),
  imgUrl: dataToJS(firebase, "imgUrl")
  // todos: orderedToJS(firebase, 'todos') // if looking for array
  // todos: dataToJS(firebase, 'myTodos'), // if using storeAs
  // todos: populatedDataToJS(firebase, 'todos', populates), // if populating
  // todos: orderedToJS(firebase, '/todos') // if using ordering such as orderByChild
}))
export default class Options extends Component {
  static propTypes = {
    options: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
    firebase: PropTypes.shape({
      set: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      database: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    }),
    auth: PropTypes.shape({
      uid: PropTypes.string
    })
  };

  state = {
    error: null
  };

  deleteTodo = id => {
    const { firebase } = this.props;

    return firebase.remove(`/options/${id}`).catch(err => {
      console.error("Error removing todo: ", err); // eslint-disable-line no-console
      this.setState({ error: "Error Removing todo" });
      return Promise.reject(err);
    });
  };

  handleAdd = option => {
    return this.props.firebase.push("/options", option);
  };

  handleSaveToDB = (key, value) => {
    return this.props.firebase.set(key, value);
  };

  render() {
    const { options, optionsNumber, imgUrl } = this.props;
    const { error } = this.state;

    return (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}
      >
        {error ? (
          <Snackbar
            open={!!error}
            message={error}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({ error: null })}
          />
        ) : null}

        {isLoaded(optionsNumber) ? (
          <div className={classes.todos}>
            <NewOptionPanel
              onSaveToDB={this.handleSaveToDB}
              onNewClick={this.handleAdd}
              disabled={false}
              number={optionsNumber}
              imgUrl={imgUrl}
            />

            {!isLoaded(options) ? (
              <CircularProgress />
            ) : (
              <Paper className={classes.paper}>
                <Subheader>Options</Subheader>
                <List className={classes.list}>
                  {options &&
                    map(options, (option, id) => (
                      <OptionItem
                        key={id}
                        id={id}
                        option={option}
                        onDeleteClick={this.deleteTodo}
                      />
                    ))}
                </List>
              </Paper>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
