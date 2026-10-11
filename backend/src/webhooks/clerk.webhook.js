// import express from "express";
// import User from "../models/user.model.js";
// import { verifyWebhook } from "@clerk/backend/webhooks";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const signingSecret = precess.env.CLERK_WEBHOOK_SIGNING_SECRET;
//     if (!signingSecret) {
//       res.status(503).json({ messsage: "Webhook secret is not provided" });
//       return;
//     }

//     // clerk's verifier expects a WEB request with the raw body ; express.raw gives a Buffer.
//     const payload = Buffer.isBuffer(req.body)
//       ? req.body.toString("utf8")
//       : String(req.body);

//     const request = new Request("http://internal/webhooks/clerk", {
//       method: "POST",
//     //   header: new Headers(req, headers),
//       headers : req.headers,
//       body: payload,
//     });

//     // throws if the signature is wrong ot he body was tampered with ; only then do we trust evt.
//     const evt = await verifyWebhook(request, { signingSecret });

//     if (evt.type === "user.created" || evt.type === "user.updated") {
//       const u = evt.data;

//       const email =
//         u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
//           ?.email_address ?? u.email_addresses?.[0]?.email_address;

//       const fullName =
//         [u.first_name, u.last_name].filter(Boolean).join(" ") ||
//         u.username ||
//         email?.split("@")[0];

//       await User.findOneAndUpdate(
//         { clerkId: u.id },
//         { clerkId: u.id, email, fullName, profilePic: u.image_url },
//         { new: true, upsert: true, setDefaultsOnInsert: true },
//       );
//     }

//     if (evt.type == "user.deleted") {
//       // const u = evt.data;
//       if (evt.data.id) await User.findOneAndDelete({ clerkId: evt.data.id });
//     }
//     res.status(200).json({ received: true });
//   }
//    catch (e) {
//     console.log("Error in Clerk Webhook",e);
//     res.status(400).json({message : "Webhook verification failed"});
//   }
// });


// export default router;


import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

// Important: use express.raw for Clerk webhooks
router.post("/", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      return res.status(503).json({ message: "Webhook secret is not provided" });
    }

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: req.headers,
      body: req.body, // raw Buffer
    });

    const evt = await verifyWebhook(request, { signingSecret });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ?? u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        { clerkId: u.id, email, fullName, profilePic: u.image_url },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    if (evt.type === "user.deleted" && evt.data.id) {
      await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error("Error in Clerk Webhook", e);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;

