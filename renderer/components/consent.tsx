import React from "react";
import { Typography, Paper } from "@material-ui/core";

const ConsentText = () => (
  <Paper style={{ maxHeight: "50vh", overflow: "scroll", padding: "1rem" }}>
    <Typography gutterBottom>
      You are being invited to participate in a research study that aims to
      collect sentences written by users of Augmentative and Alternative
      Communication (AAC) interfaces. These sentences will help improve AAC text
      entry interfaces. Contributed sentences will become part of a public data
      set. This study is being conducted by Dr. Keith Vertanen from the
      Department of Computer Science at Michigan Technological University.
    </Typography>

    <Typography gutterBottom component="span">
      To take part, you must meet the following requirements:
      <ul>
        <li>You must be 18 years of age or older</li>
        <li>
          You must use an AAC interface for at least some of your communication
          needs
        </li>
        <li>
          You must use an AAC interface that logs your writing to a simple text
          file (such as Dasher)
        </li>
      </ul>
    </Typography>

    <Typography gutterBottom>
      If you agree to take part, you will install our application on your
      computer. You will point the application at a text file of things you have
      written using your AAC interface. You can then select whatever sentences
      you would like to share with the project. You can share as many sentences
      as you would like. You can return to our application whenever you would
      like to share more sentences.
    </Typography>

    <Typography gutterBottom component="span">
      We take your privacy seriously. When you start our application, you can
      choose the amount of information you want associated with the sentences
      you share:
      <ol>
        <li>
          <b>None:</b> Only the text of your selected sentences will be shared.
          We will add your sentences to a large anonymous pool of sentences.
          There will be no way to know which sentences in this pool came from
          any particular person.
        </li>
        <li>
          <b>Anonymous ID:</b> Our application will assign you an anonymous ID
          (a large random string). All your uploaded sentences will be
          associated with this ID. This will help researchers with some kinds of
          experiments (such as how to improve language model personalization).
        </li>
        <li>
          <b>Anonymous ID + user details:</b> You will be assigned an anonymous
          ID. Associated with this ID, you can provide additional details about
          yourself such as:
          <ul>
            <li>Age</li>
            <li>Gender</li>
            <li>Condition</li>
            <li>Years of experience with your AAC interface</li>
            <li>Computer input method</li>
          </ul>
          All these fields are optional. These details will help researchers
          understand the diversity of users and range of interfaces in our data.
        </li>
      </ol>
    </Typography>

    <Typography gutterBottom>
      We review your data for any privacy compromising information before we add
      it to our public data set. We only add sentences to our public data set
      that you have uploaded more than a month ago. This gives you time to
      remove sentences before they become part of the public data set.
    </Typography>

    <Typography gutterBottom>
      We will honor requests to retroactively remove sentences from the public
      data, but copies may exist that are outside of our control.
    </Typography>

    <Typography gutterBottom>
      There are no known risks if you decide to participate in this research
      study. There are no costs to you for participating in the study. You will
      not immediately benefit from taking part. However, your efforts may lead
      to improvements to the interfaces used by you and others. You have the
      right to delete any of the data you contribute.
    </Typography>

    <Typography gutterBottom>
      Your participation in this study is voluntary. By clicking the Accept box
      below, you are voluntarily agreeing to participate. You are also agreeing
      that your sentences may be used in a public data set. You are free to skip
      any parts of this study without penalty.
    </Typography>

    <Typography gutterBottom>
      If you have any questions about this study, please contact Dr. Keith
      Vertanen at (906) 487-2331 or vertanen@mtu.edu.
    </Typography>

    <Typography gutterBottom>
      The Michigan Tech Institutional Review Board (IRB) has reviewed my request
      to conduct this project. If you have any concerns about your rights in
      this study, please contact Michigan Tech&apos;s IRB at (906) 487-2902 or
      irb@mtu.edu.
    </Typography>
  </Paper>
);

export default ConsentText;
