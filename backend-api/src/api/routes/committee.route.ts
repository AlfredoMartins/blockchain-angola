import Committee from '../../committee/committee';
import { Otp, PROVINCES_PORT } from '../../committee/data_types';
import emailTemplate from '../../email_center/emailTemplate';
import sendEmail from '../../email_center/sendEmail';
const jwt = require('jsonwebtoken');

const axios = require('axios');
const LOCALHOST = 'http://localhost:';
const NODE_ADDRESS = "?"; //Let's assume we already know comming from the higher level.

const dotenv = require("dotenv");
dotenv.config();

const express = require("express")
const router = express.Router()

const committee = new Committee();

const cookieParser = require('cookie-parser');

// middleware for cookies
express().use(cookieParser());

router.get('/', (req, res) => {
   res.status(401).json({});
})

router.get('/registers', (req, res) => {
   res.json({ registers: committee.getCitizens(), note: "Request accepted ..." });
})

router.get('/generate-identifiers', async (req, res) => {
   const ans = await committee.generateIdentifiers();
   res.json({ voters: ans, note: "Request accepted ..." });
})


router.post('/add-candidate', async (req, res) => {
   let data = req.body;
   if (!data.name || !data.party || !data.code) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors

   const name = data.name;
   const code = parseInt(data.code);
   const party = data.party;
   const acronym = data.acronym;
   const status = data.status;

   const ans = await committee.addCandidateCommittee(name, code, party, acronym, status);
   if (ans) {
      res.status(200).send({
         note: "Request accepted, candidate added.",
         candidates: ans
      });
   } else {
      res.status(401).send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/add-user', async (req, res) => {
   let data = req.body;
   if (!data.name || !data.username || !data.role || !data.password) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors

   const ans = await committee.addUser(data);
   if (ans) {
      res.send({
         note: "Request accepted, user added.",
         users: ans
      });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.get('/clear-candidates', async (req, res) => {
   res.json({ candidates: committee.clearCandidates(), note: "Request accepted ..." });
})

router.get('/candidates', async (req, res) => {
   const ans = await committee.getCandidates();
   if (ans) {
      res.json({ candidates: ans, note: "Request accepted ..." });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

// status(400)
router.get('/announcement', async (req, res) => {
   const ans = await committee.getAnnouncement();
   if (ans) {
      res.json({ announcement: ans, note: "Request accepted ..." });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/deploy-announcement', async (req, res) => {
   let data = req.body;
   if (!data.startTimeVoting || !data.endTimeVoting || !data.dateResults || !data.numOfCandidates || !data.numOfVoters) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors

   const ans = await committee.deployAnnouncement(data);
   if (ans) {
      res.status(201).send({
         note: "Request accepted, user added.",
      });
   } else {
      res.status(400).send({ note: "Rejected. Something went wrong ..." });
   }
})

router.get('/users', async (req, res) => {
   const ans = await committee.getUsers();
   if (ans) {
      res.json({ users: ans, note: "Request accepted ..." });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.get('/voter-identifiers', async (req, res) => {
   const ans = await committee.getVotersGenerated();
   res.json({ registers: ans, note: "Request accepted ..." });
})

router.get('/clear-registers', (req, res) => {
   res.json({ registers: committee.eraseCitzens(), note: "Request accepted ..." });
})

router.get('/clear-users', (req, res) => {
   res.json({ users: committee.eraseUsers(), note: "Request accepted ..." });
})

router.post('/delete-user', async (req, res) => {
   let data = req.body;
   if (!data.username) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors
   const username = data.username;
   const ans = await committee.eraseUser(username);
   if (ans) {
      const users = await committee.getUsers();
      res.send({ users: users, note: "Request accepted ..." });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/delete-register', async (req, res) => {
   let data = req.body;
   if (!data.electoralId) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors
   const electoralId = data.electoralId;
   const ans = await committee.eraseRegister(electoralId);
   if (ans) {
      const citizens = await committee.getCitizens();
      res.status(200).send({ registers: citizens, note: "Request accepted ..." });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/register-voter', async (req, res) => {
   let data = req.body;   
   if (!data.electoralId || !data.name || !data.email || !data.address || !data.province || !data.password) return res.status(400).json({ note: "Rejected." });

   try {
      if (await committee.addCitzen(data)) {
         res.status(201).send({
            note: "Request accepted, citzen registered.", message: "Please hold on there, you might get an e-mail with details on how to access your account, otherwise contact the voter committee.",
            registers: committee.getCitizens()
         });
      } else {
         res.status(401).send({ note: "Rejected. Something went wrong ..." });
      }
   } catch(e) {
      console.log(e);
      res.status(401).send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/update-citizen', async (req, res) => {
   let data = req.body;
   if (!data.electoralId || !data.name || !data.email || !data.address || !data.province || !data.status) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors

   const ans = await committee.updateCitizen(data);
   if (ans) {
      res.send({
         note: "Request accepted, citzen updated.", message: "Success!",
         registers: committee.getCitizens()
      });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

const verifyJWT = require('../../middleware/verifyJWT');
const verifyJWTWeb = require('../../middleware/verifyJWTWeb');
const credentials = require('../../middleware/credentials');

express().use(credentials);

router.post('/update-user', async (req, res) => {
   let data = req.body;
   if (!data.name || !data.username || !data.role) return res.status(400).json({ note: "Rejected." }); // Changed status code to 400 for client errors

   const ans = await committee.updateUser(data);
   if (ans) {
      res.send({
         note: "Request accepted, user updated.", message: "Success!",
         users: committee.getUsers()
      });
   } else {
      res.send({ note: "Rejected. Something went wrong ..." });
   }
})

router.post('/send-email', async (req, res) => {
   const data = req.body;

   if (!data.email) return res.status(400).json({ note: "Rejected. Email is required." }); // Changed status code to 400 for client errors

   try {
      const email = data.email;
      const citizen = committee.getCitizens().find(x => x.email.localeCompare(email) === 0);

      if (!citizen) return res.status(404).json({ note: "Rejected. Citizen not found." }); // Return 404 if citizen not found

      const otp = citizen.otp;
      const textContent = "Your otp details: " + JSON.stringify(otp);

      let textQRCode = "";
      let htmlContent = "";

      try {
         const qrCodeData = await committee.generateQRCode(otp.otpauth_url);
         if (qrCodeData) {
            textQRCode = qrCodeData;
            htmlContent = emailTemplate(otp, citizen.name, textQRCode);
         } else {
            console.log("Failed to generate QR code.");
         }
      } catch (error) {
         // console.error("Error generating QR code:", error);
      }

      let ans = true;

      try {
         await sendEmail(email, textContent, htmlContent);
      } catch (error) {
         // console.error(error);
         ans = false;
      }

      if (ans) {
         res.status(200).json({ note: "Success" });
      } else {
         res.status(500).json({ note: "Rejected. Failed to send email." });
      }
   } catch (error) {
      // console.error(error);
      res.status(500).json({ note: "Rejected. Internal server error." });
   }
});

router.post('/verify-otp', verifyJWT, async (req, res) => {
   const data = req.body;

   if (!data.email || !data.token || !data.otpCode) return res.status(400).json({ note: "Rejected. Email is required." }); // Changed status code to 400 for client errors
   
   // Lets pretend for a while that all the requests are good, just for testing purpose ...

   try {
      const email = data.email;
      const token = data.token; // I only needed to pass the jwt verification.
      const otpCode = data.otpCode;
      const citizen = committee.getCitizens().find(x => x.email.localeCompare(email) === 0);

      console.log("Verify-OTP: ", citizen);
      
      if (!citizen) return res.status(404).json({ note: "Rejected. Citizen not found." }); // Return 404 if citizen not found
      
      const ans = committee.verifyOtp(citizen.otp.base32, otpCode);
      console.log("OTP Valid? => ", ans);

      setTimeout(() => {
         if (ans) {
             res.status(200).json({ note: "Verified" });
         } else {
             res.status(401).json({ note: "Failed." });
         }
     }, 1000);
   } catch (error) {
      console.error(error);
      res.status(500).json({ note: "Rejected." });
   }
})

express().use(verifyJWT);

router.post('/auth-mobile', async (req, res) => {
   let data = req.body;
   let electoralId = data.electoralId;
   let password = data.password;

   if (!electoralId || !password) return res.status(500).json({ 'message': 'Something went wrong.' });

   try {
      const ans = await committee.authMobile(electoralId, password);
      // create JWTs
      const accessToken = jwt.sign(
         {
            "electoralId": ans.electoralId,
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '10m' }
      );

      const refreshToken = jwt.sign(
         { "electoralId": ans.electoralId },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: '5d' }
      );

      // Saving refreshToken with current user
      await committee.updateTokenCitzen(electoralId, refreshToken)

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // Let's set secure: false for now.

      if (ans !== null) {
         return res.status(201).send({ accessToken: accessToken, email: ans.email, port: PROVINCES_PORT[ans.province] });
      } else {
         return res.send({ note: "Rejected. Something went wrong ..." });
      }
   } catch (error) {
      res.status(500).send({ note: "Internal server error" });
   }
});

express().use(verifyJWTWeb);
router.post('/auth-web', async (req, res) => {
   let data = req.body;
   let username = data.username;
   let password = data.password;

   if (!username || !password) return res.status(500).json({ 'message': 'Something went wrong.' });

   try {
      const ans = await committee.authWeb(username, password);

      // Create JWTs
      const accessToken = jwt.sign(
         {
            "username": ans.username,
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: '60m' }
      );

      const refreshToken = jwt.sign(
         { "username": ans.username },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: '5d' }
      );

      await committee.updateTokenUser(username, refreshToken)

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Strict', secure: false, maxAge: 24 * 60 * 60 * 1000 }); // Let's set secure: false for now. 

      if (ans !== null) {
         return res.status(201).send({ accessToken: accessToken, refreshToken: refreshToken, username: username, name: ans.name, role: ans.role });
      } else {
         return res.send({ note: "Rejected. Something went wrong ..." });
      }
   } catch (error) {
      res.status(500).send({ note: "Internal server error" });
   }
});

router.get('/refresh-token', verifyJWT, (req, res) => {
   try {
      if (req.headers.cookie === null) return res.sendStatus(403);

      let cookie = req.headers.cookie;
      cookie = cookie.split('=')[1];
      const cookies = {
         jwt: cookie
      }

      if (!cookies?.jwt) return res.sendStatus(401);
      const refreshToken = cookies.jwt;

      const foundUser = committee.getCitizens().find(x => x.refreshToken.localeCompare(refreshToken) === 0);
      if (!foundUser) return res.sendStatus(403); //Forbidden 

      return jwt.verify(
         refreshToken,
         process.env.REFRESH_TOKEN_SECRET,
         (err, decoded) => {
            if (err || foundUser.electoralId !== decoded.electoralId) res.sendStatus(403);

            const accessToken = jwt.sign(
               { "electoralId": decoded.electoralId },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: '60m' }
            );

            return res.status(200).json({ accessToken }); // Send JSON response containing access token
         }
      );

   } catch (error) {
      return res.sendStatus(500); // Forbidden
   }
})

router.get('/refresh-token-web', async (req, res) => {
   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(' ')[1]
   // console.log("token: ", token);

   if (token == null) return res.sendStatus(401)

   try {
      const cookies = {
         jwt: token
      }

      const refreshToken = cookies.jwt;
      const foundUser = committee.getUsers().find(x => x.refreshToken === refreshToken);

      if (!foundUser) return res.sendStatus(403); //Forbidden 

      // Evaluate jwt 
      return jwt.verify(
         refreshToken,
         process.env.REFRESH_TOKEN_SECRET,
         async (err, decoded) => {
            if (err) {
               // console.log("Session has expired.");
            }

            if (err || foundUser.username !== decoded.username) {
               return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
               { "username": decoded.username },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: '600s' }
            );

            const refreshToken = jwt.sign(
               { "username": decoded.username },
               process.env.REFRESH_TOKEN_SECRET,
               { expiresIn: '1d' }
            );

            await committee.updateTokenUser(foundUser.username, refreshToken);

            res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'Strict', secure: false, maxAge: 24 * 60 * 60 * 1000 });
            return res.status(201).send({ accessToken: accessToken, refreshToken: refreshToken});
         }
      );
   } catch (error) {
      return res.sendStatus(500); //Forbidden 
   }
})

router.get('/log-out', (req, res) => {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(204); //No content
   const refreshToken = cookies.jwt;

   // Is refreshToken in db?
   const foundUser = committee.getCitizens().find(x => x.refreshToken === refreshToken);
   if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
   }

   // Delete refreshToken in db
   committee.updateTokenCitzen(foundUser.electoralId, '');

   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
   res.sendStatus(204);
})

router.get('/log-out-web', (req, res) => {
   // On client, also delete the accessToken

   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(204); //No content
   const refreshToken = cookies.jwt;

   // Is refreshToken in db?
   const foundUser = committee.getUsers().find(x => x.refreshToken === refreshToken);
   if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
   }

   // Delete refreshToken in db
   committee.updateTokenUser(foundUser.username, '');

   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
   res.sendStatus(204);
})

module.exports = router;