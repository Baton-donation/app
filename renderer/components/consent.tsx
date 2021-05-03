import React from "react";
import { Typography, Paper } from "@material-ui/core";

const ConsentText = () => (
  <Paper style={{ maxHeight: "50vh", overflow: "scroll", padding: "1rem" }}>
    <Typography gutterBottom>
      You are invited to take part in a research study collecting sentences
      written by users of Augmentative and Alternative Communication (AAC)
      interfaces. Contributed sentences will become part of a public data set.
      This data set will be available for download by researchers working to
      improve AAC text entry interfaces.
    </Typography>

    <Typography gutterBottom component="span">
      This study is being conducted by:
      <ul>
        <li>
          Dr. Keith Vertanen from the Department of Computer Science at Michigan
          Technological University. Dr. Vertanen is an expert on text input by
          people with diverse abilities. He contributes to the open-source AAC
          text entry interfaces Dasher and Nomon. He has been a consultant for
          Tobii Dynavox, helping to improve gaze-based text input. He is a
          recipient of a National Science Foundation (NSF) CAREER award to
          investigate context-aware AAC text input.
        </li>
        <li>
          Will Wade, PGDip, Bsc (Hons) is a Senior AAC Consultant at the Ace
          Centre. He leads access assessments for individuals across the
          northwest of England. He teaches on a Masters course in Assistive
          Technology at Manchester Metropolitan University.
        </li>
        <li>
          Owen Kent is an entrepreneur and researcher focusing on assistive
          technologies. A graduate of UC Berkeley, he has over seven years of
          experience advising engineering teams ranging from high school
          students to postdocs building technology for people with disabilities.
        </li>
      </ul>
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
        <li>You must not have a cognitive impairment</li>
      </ul>
    </Typography>

    <Typography gutterBottom>
      If you agree to take part, you will install our custom application on your
      computer. You will point the application at a text file of things you have
      written using your AAC interface. You can then select whatever sentences
      you would like to share with the project. You can share as many sentences
      as you would like. You can return to our application whenever you would
      like to share more sentences. The application only runs upon request; it
      does not run in the background or otherwise monitor your day-to-day
      computer activities. You can uninstall the application at any time.
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
      The study team periodically reviews your uploaded data for any privacy
      compromising information. We only add sentences to our public data set
      that you have uploaded more than a month ago. This gives you time to
      remove sentences before they become part of the public data set. We will
      honor requests to retroactively remove sentences from the public data, but
      copies may exist that are outside of our control.
    </Typography>

    <Typography gutterBottom>
      Before we upload your data, we encrypt it for anonymous delivery to our
      cloud server. This process uses our project&apos;s public encryption key.
      Our private key is needed to read any data encrypted with our public key.
      We store our private key separately on a non-networked device. This
      ensures even if our cloud server were hacked, your uploaded data cannot be
      read. We periodically retrieve data from the cloud server, decrypting it
      on our local computer. For each sentence you upload, our application
      stores a unique random ID on your computer. This unique ID allows you to
      delete any sentences you may have uploaded accidentally.
    </Typography>

    <Typography gutterBottom>
      The only known risk to taking part in this research study is that you
      might accidentally share sentences containing private information. We
      believe the risk of this information becoming public is small given how we
      store and review your data. There are no costs to you for participating in
      the study. You will not immediately benefit from taking part. However,
      your efforts may lead to improvements to the interfaces used by you and
      others. You have the right to delete any of the data you contribute.
    </Typography>

    <Typography gutterBottom>
      Your participation in this study is voluntary. By clicking &quot;Agree and
      continue&quot;, you are voluntarily agreeing to take part. You agree that
      your contributed data may be used in a public data set. You are free to
      skip any parts of this study without penalty.
    </Typography>

    <Typography gutterBottom>
      If you have any questions about this study, please contact Dr. Keith
      Vertanen at (906) 487-2331 or vertanen@mtu.edu. The Michigan Tech
      Institutional Review Board (IRB) has reviewed my request to conduct this
      project. If you have any concerns about your rights in this study, please
      contact Michigan Tech&apos;s IRB at (906) 487-2902 or irb@mtu.edu.
    </Typography>
  </Paper>
);

export default ConsentText;
