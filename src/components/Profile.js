import React, { Component } from "react";
import fire from "../config/firebaseConfig";
import {
  Layout,
  Header,
  Navigation,
  Drawer,
  Content,
  Card,
  CardActions,
  CardTitle,
  CardText,
  Button,
  Badge,
  Icon,
  Textfield,
  ProgressBar,
  Tooltip
} from "react-mdl";

import "./App.css";
import { isNullOrUndefined } from "util";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      image: null,
      url: "",
      progress: 0
    };
    this.handleReset = this.handleReset.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangee = this.handleChangee.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleChangee = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      console.log(image);
      this.setState(() => ({ image }));
    }
  };
  handleUpload = () => {
    const { image } = this.state;
    const uploadTask = fire
      .storage()
      .ref(`images/${image.name}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        console.log("Progress");
        // progrss function ....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        console.log("Done");
        fire
          .storage()
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            this.setState({ url });
          });
      }
    );
  };
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    //alert("Edited succesfully: ");
    // event.preventDefault();
    //var database = fire.database();

    console.log();

    console.log("asd");
    fire
      .database()
      .ref("users/likks/")
      .set(
        {
          usn: this.state.value1,
          email: this.state.value2,
          sem: this.state.value3,
          contact: this.state.value4
        },
        () => {
          console.log("ads");
        }
      );
    console.log();
    /*console.log(usn);
    console.log(email);
    console.log(sem);
    console.log(contact);*/
  }
  /* handleReset = () => {
   this.setState({
     value1: "",
     value2: "",
     value3: "",
     value4: ""
   });
 };*/
  handleReset(event) {
    this.setState({
      value1: null,
      value2: null,
      value3: null,
      value4: null
    });
  }

  firebaseSignOut()
  {
    fire.auth().signOut();
  }

  render() {
    return (
      <div style={{ height: "500px", position: "relative" }}>
        <Layout fixedHeader>
          <Header
            className="headcol"
            title={
              <span>
                <span style={{ color: "#ddd" }}> </span>
                <strong>My Profile</strong>
              </span>
            }
          >
            <Navigation>
              <Textfield
                onChange={() => {}}
                label="Search Project..."
                style={{ width: "200px" }}
              />

              <a href="#">Help & Feedback</a>
              <a href="/sprofile">Edit Profile</a>
              <a href="auth" onClick={this.firebaseSignOut.bind(this)}>Sign Out</a>
            </Navigation>
          </Header>
          {/*} <Card
           className="dp"
           shadow={5}
           style={{
             float: "left",
             width: "280px",
             height: "300px",
             background:
               "url(data:image/png;base64,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) center / cover"
           }}
         >
           <CardTitle expand />
         </Card> */}

          <div
            style={{
              height: "100vh",
              width: "100px",
              display: "flex",
              flexDirection: "column"
              //alignItems: "center",
              //justifyContent: "center"
            }}
          >
            {" "}
            <br />
            <img
              style={{ width: "250px" }}
              src={this.state.url || "http://via.placeholder.com/150"}
              alt="Uploaded images"
              height="300"
              width="400"
            />
            <br />
            <progress
              style={{ width: "250px" }}
              value={this.state.progress}
              max="100"
            />
            <br />
            <input type="file" onChange={this.handleChangee} />
            <button
              type="button"
              class="btn btn-outline-danger m-3"
              onClick={this.handleUpload}
            >
              Upload
            </button>
            <br />
          </div>
          <form
            style={{
              width: "300px",
              position: "absolute",
              left: "400px ",
              top: "100px"
            }}
            onSubmit={this.handleSubmit}
          >
            <label>
              Name:
              <br />
              <Textfield
                onChange={text1 => {
                  this.setState({ value1: text1.target.value });
                }}
                value={this.state.value1}
                label="Enter name...         "
                style={{ width: "300px" }}
              />
            </label>
            <br />
            <br />
            <label>
              Email:
              <br />
              <Textfield
                onChange={text2 => {
                  this.setState({ value2: text2.target.value });
                }}
                value={this.state.value2}
                label="Enter email ID...         "
                style={{ width: "300px" }}
              />
            </label>
            <br />
            <br />
            <label>
              Sem:
              <br />
              <Textfield
                onChange={text3 => {
                  this.setState({ value3: text3.target.value });
                }}
                value={this.state.value3}
                label="Enter Sem...         "
                style={{ width: "300px" }}
              />
            </label>

            <br />
            <br />
            <label>
              Contact No:
              <br />
              <Textfield
                onChange={text4 => {
                  this.setState({ value4: text4.target.value });
                }}
                value={this.state.value4}
                label="Enter contact no...         "
                style={{ width: "300px" }}
              />
            </label>
            <br />
            <button
              onClick={this.handleSubmit}
              type="button"
              class="btn btn-outline-danger m-3 "
            >
              Submit
            </button>

            <button
              onClick={this.handleReset}
              // onClick={this.handleReset}
              type="button"
              class="btn btn-outline-danger m-3"
            >
              Reset
            </button>
          </form>

          <Content />
        </Layout>
      </div>
    );
  }
}
