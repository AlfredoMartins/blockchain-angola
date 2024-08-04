
![🚀 BlockChain Angola Banner](public/images/blockchain_background.svg)

<div align="center">
    <strong><a href="https://www.youtube.com/playlist?list=PL3FCe9r4avxF5OAZdxIAxMeC3--3c6OwU" style="text-decoration: none; color: inherit;">👀 Watch it in action 🤯 →</a></strong>
</div>

# About Blockchain Angola
A full-stack Web and Mobile application for Angolan election using Blockchain Technology behind the scenes. The system presents a user-friendly Interface accessible via both mobile and web platforms. 

Committee members can seamlessly access the application through their browser, while voters have the convenience of utilizing their smartphones, whether running on iOS or Android.

In summary, the system enables users to authenticate themselves within the application, manage the content, send data, scan QR codes, observe live projections, analyze charts, and gain insights into blockchain representations through graphical means, among other functionalities. It is worth noting that, depending on the viewer's perspective, the interface may appear somewhat complex, particularly regarding the graphical illustration of blockchain operations.

# Quick Start Guide

In this section, we provide a showcase of the application working in real-time.

## Tutorial and Video Demonstrations

Alongside the tutorial, we offer a comprehensive video demonstration highlighting the key functionalities of the complete system. These videos provide a visual walkthrough of the application’s features, emphasizing its user-friendly interface and collaborative capabilities.

You can access the tutorials and demonstrations via the link provided.

**Links:** [Citizen (Mobile), Committee (Web) and System Administrators (Console)](https://www.youtube.com/playlist?list=PL3FCe9r4avxF5OAZdxIAxMeC3--3c6OwU)

# Table of Contents

1. [Introduction](#introduction)
   - [About Blockchain Angolan](#what-is-blockchain-angola)
   - [Features](#features)
   - [Technologies Used](#technologies-used)

2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Setup Instructions](#setup-instructions)
   - [Configuration](#configuration)


## Set-up Considerations

To enhance user experience, we suggest the following tools with their versions for better compatibility:

| **Tool**                   | **Version**                                          |
|----------------------------|------------------------------------------------------|
| **iOS**         | 17.4.1 or later                                      |
| **Android**     | 13 or later                                          |
| **Expo SDK**  | 49 or later                                          |
| **Google Chrome** | 124.0.6367.93 (Official Build) or later           |
| **Docker** | 4.29.0 (145265) or later                             |

*Table 1: Software with their compatibility version*

### Network Requirements:

| **Requirement**   | **Minimum Value** |
|-------------------|-------------------|
| **Download Speed** | 15.79 Mbps        |
| **Upload Speed**   | 40.13 Mbps        |

*Table 2: Network Requirements*

---

## Establish Network in Data Center

As a first step, you need to install **Docker**. On your operating system, download and install the Docker image that contains the server we are going to use. Ensure that there is at least 10 GB of memory available on your machine (server) to avoid inconsistency on the server.

Start the Docker container. Once started, a menu will be displayed, which you can control depending on your goal.

![Docker image](public/images/docker/01.png)
*Figure 1: Docker image*

![Docker container](public/images/docker/02.png)
*Figure 2: Docker container*

![Docker container up and running](public/images/docker/03.png)
*Figure 3: Docker container up and running*

The image will be provided in the root folder `/image` of the thesis submission. To start, simply click on the button icon **RUN** and specify the **PORT** you want to work on.

![Docker runs a new container](public/images/docker/04.png)
*Figure 4: Docker runs a new container*

If everything is working fine, you should see an output similar to this:

![Docker running successfully](public/images/docker/03.png)
*Figure 5: Docker running successfully*

These steps are also accessible via the console using the command line in the developer documentation chapter. For more details, you can refer to it as well.


## Server Setup

The web interface in the browser has a Node.js back-end server. If you're running it on a local machine, you can start the server using the following command:

`$ npm run dev`

### Access to the System (Web)

Open any internet browser (e.g., **Google Chrome, Firefox, Safari**, etc.) and enter the following URL into the browser's address bar: [http://localhost:3007/](http://localhost:3007/). During the development phase, `3007` was the default `PORT`; please adjust the `PORT` number accordingly.

![Using Google Chrome](public/images/web/00.png)
*Figure 1: Using Google Chrome*

Press the `ENTER` key, and the login page will appear.

# Developer Documentation

## Installation & Setup Guide

## Development Environment

While developers have the flexibility to choose any Integrated Development Environment (IDE), this guide uses **Visual Studio Code** for consistency. Please follow the steps outlined below to install and set up your development environment.

You can download and install Visual Studio Code from the following link: [Visual Studio Code Download](https://code.visualstudio.com/Download).

## Environment Setup

**Node.js** is an open-source, cross-platform JavaScript runtime environment that developers use to build servers, web applications, command-line tools, and scripts. We require Node.js to execute all components currently under development. Alongside Node.js, we will also be using npm (Node.js package manager).

### Node.js Package Manager (npm)

npm is the primary package manager utilized within the Node.js ecosystem. It simplifies the process of installing, updating, and managing dependencies for your Node.js projects.

### Project Structure

Each part of the project is structured as an individual code base. You can access the source code for each project either from the root of the thesis submission file or by cloning the repositories from GitHub.

#### Repository Links:

- [Web front-end](https://github.com/CodeTyperPro/blockchain-web-frontend.git)
- [Mobile front-end](https://github.com/CodeTyperPro/blockchain-mobile-frontend.git)
- [Back-end](https://github.com/CodeTyperPro/blockchain-backend-api)

### Cloning the Repositories

To clone the repositories to your local development environment, open your terminal or command-line interface and navigate to the directory where you want to clone the project. Then, use the following command:

```bash
$ git clone https://github.com/<username>/<repository>
> Cloning into `Spoon-Knife`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remote: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```

### Set Environment Variables

#### Encryption and Decryption Secrets

The encryption and decryption keys can be generated by running a script which can be found in the codebase under `src/crypto/genKey.ts` in the backend project. 

Once there, simply run the command, and you will see the keys in the console output and written to a `secret.key` file.

```shell
$ tsnd --respawn src/crypto/genKey.ts
# Sample output
[INFO] 11:34:24 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.4.3)
Secret key has been written to 'secret.key' file.
KEY:  252ea9d12942dff0014784390f781fbad6a37746af11600abbb276
IV:  d50786ca0f68f489f538983262ff0a6f
```

Whenever the command above is executed from the root project directory, new *key pairs* (`<key, iv>`) are generated. Subsequently, developers must copy and paste them accordingly into the `.env` file. As shown, placeholder values are currently set as `"..."`, which will eventually be replaced by actual values.


#### JWT Keys Generation

This time, to generate a more secure and lengthy series of credentials for **JWT**, we utilize **OpenSSL**.

**OpenSSL** is a software library used in applications to ensure secure communications over computer networks, preventing eavesdropping and verifying the identity of the communicating parties [source](https://www.openssl.org/).

## JWT Keys Generation

To generate JWT keys, we'll use **OpenSSL**. Below are the installation steps and commands to generate the key.

### Installation

#### Linux:

```shell
$ sudo apt-get update
$ sudo apt-get install openssl
```

#### Mac:

```shell
$ brew install openssl
````

### Key Generation
```shell
$ openssl genrsa -out secret.key 2048
$ cat secret.key
# Sample output
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtSgLQD33cxNYp
av0Q6SQgjIdztH+/970mvgJtR3R/zX6Mc3ygmkIJOm8mkgUznPDpS94vTP/3LYlM
q7HzNsOg/QvFhQ4F8xGlSmHDE+eAGfgj8tb++aDX+wVOfk3gkiZU+8H3jQLr9cMk
Sh5FRlIBcX/LVIqnasY81AruCiE8MfM9yUiycx0zIrNswpMYXdIb5TthnQEkyPY6
rM00KfTLtfqlocJW8U8g/REpGDxR2LTDBc...
-----END PRIVATE KEY-----
```
Bear in mind that if this process fails, you can optionally use a key generated in the Encryption and Decryption part.

## Firebase Credentials / Storage Secrets

We encourage developers to explore the [Google Firebase documentation](https://firebase.google.com/docs) to learn how to obtain credentials. This helps avoid unnecessary lengthening of the documentation, as settings may change over time. Please refer to the complete procedure for Web and Mobile settings using the [following link](https://firebase.google.com/docs/web/setup) [source](https://firebase.google.com/docs).

It is worth noting that this link may become broken over time. Optionally, you can conduct research using Google archives.

## OpenAI Credentials

Similarly, please explore the link [source](https://beta.openai.com/docs/api-reference/authentication) for OpenAI credentials.

Assuming all the requirements mentioned previously are met, these variables must be set accordingly:

```shell
# BACKEND /.ENV:

# Encryption and decryption credentials
SECRET_KEY_VOTES=...
SECRET_IV_VOTES=...

SECRET_KEY_IDENTIFIER=...
SECRET_IV_IDENTIFIER=...

# JWT credentials
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...

# Mailer credentials
MAILER_SERVICE=Gmail
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_USER=...
MAILER_PASS=...

# MOBILE /.ENV:

# Firebase credentials
API_KEY=...
AUTH_DOMAIN=election-blockchain.firebaseapp.com
PROJECT_ID=election-blockchain
STORAGE_BUCKET=election-blockchain.appspot.com
MESSANGING_SENDER_ID=...
APP_ID=...

# FRONTEND /.ENV:

# Firebase credentials
API_KEY=...
AUTH_DOMAIN=election-blockchain.firebaseapp.com
PROJECT_ID=election-blockchain
STORAGE_BUCKET=election-blockchain.appspot.com
MESSANGING_SENDER_ID=...
APP_ID=...

# Open AI credentials
ORGANIZATION=org-8DxV2NIjwStZ2eFMwq3HI2KP
PROJECT_ID=proj_t2WJqJ4Mt5W3wrZAbaJxW4UI
OPENAI_API_KEY=sk-proj-...
```

In addition, It is important to mention that if any of the variables are not properly set up, the corresponding features may not work as expected.

## Run Development Environment

Now that we are all set, we can finally up and run all the servers. We separate accordingly depending on the platform we wish to run.

### Backend

```shell
$ tsnd --respawn src/network.ts 3010
```

Sample output:
```shell
SOCKET: listening on *: 3010 | NODE ADDRESS: 3010
Press "M" or "m" to open the menu.
```

Mobile:
```bash
$ npx expo start
```

Sample output:
```bash
› Metro waiting on exp://192.168.0.38:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› QR Code
› Using Expo Go
...
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
...
› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
```

Web
```shell
$ npm run dev
```

Sample output:
```shell
> blockchain-web-frontend@0.0.0 dev
> vite
  VITE v5.2.8  ready in 191 ms
  ➜  Local:   http://localhost:3007/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

# REST API Documentation

All data transference is handled by the Express RESTful API server. This server supports `GET`, `POST`, `PUT`, and `DELETE` HTTP request methods for both web and mobile applications.

## Base URL of the Application

```perl
BASE URL -> http://<localhost>:<port>/api/
SAMPLE BASE URL -> http://localhost:3010/api/

HTTP/1.1
X-Powered-By: Express
Accept: /
Connection: keep-alive
Content-type: application/json; charset=utf-8
```

## Routes

Our routes are divided into two main groups of endpoints:

| **Group** | **Route** |
| --- | --- |
| [Blockchain](#blockchain-routes) | `/api/blockchain/` |
| [Committee](#committee-routes) | `/api/committee/` |

Some endpoints require passing through middleware for authorization. There are two main types of middleware:

1. **Credentials Access-Control-Allow-Credentials**: Restricts requests to a limited number of client URLs.
2. **JWT**: For authorization and authentication. Some endpoints are accessible only with a valid token, otherwise, a "Not Authorized" response is returned.

### Endpoints

Here are some of the most important endpoints provided by our REST API. For additional endpoints, refer to the source code or appendix in the full documentation.

#### Blockchain Routes

```perl
Directory: `src/api/routes/blockchain.routes.ts`
BASE URL: http://<localhost>:<port>/api/blockchain/
```

| **HTTP Request** | **Body** | **Description** |
| --- | --- | --- |
| `GET /` | Empty | Returns the complete blockchain state on the server. |
| `GET /pending-transaction` | Empty | Adds a transaction to the pending transaction pool waiting to be mined. |
| `GET /transactions` | Empty | Returns all transactions in the blockchain. |
| `GET /blocks` | Empty | Returns all blocks in the blockchain. |
| `GET /blocks-detail/:id` | Empty | Returns details of a specific block in the blockchain. |
| `POST /transaction` | `identifier, choiceCode` | Adds a new transaction to the pending pool and registers it to the blockchain after approval. |

##### Example POST Request (Server-side)

```typescript
router.post('/transaction', async (req, res) => {
    let data = req.body;
    if (checkVote(data.identifier, parseInt(data.choiceCode))) {
        try {
            ...
            if (ans !== null) {
                res.status(201).send({ node: 'Data received and will be added to the transactions.', details: ans });
            } else {
                res.status(401).send({ node: 'Data received but invalid. Please try again later!', ans });
            }
        } catch (error) {
            console.log(error);
            res.status(401).send({ node: 'Data received but invalid. Please try again later!', data });
        }
    } else {
        res.status(500).send({ node: 'Failed!', data });
    }
});
```

##### Example POST Request (Client-side)

```typescript
const placeVote = async (): Promise<string> => {
    const body = { identifier: authState?.electoralId, choiceCode: (id + 1), secret: authState?.token };
    const response = await axios.post(TRANSACTION_URL, body);
    const statusCode = response.status;

    if (statusCode === 201) {
        const transactionHash = response.data.details.transactionHash;
        return transactionHash;
    }

    return "";
}
```

#### Committee Routes

```perl
Directory: src/api/routes/committee.routes.ts
BASE URL: http://<localhost>:<port>/api/committee/
```

Additional endpoints are accessible in the full documentation or back-end source code.

| **HTTP Request**              | `GET /`                                            |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Returns empty object. Used only for testing purposes.` |

| **HTTP Request**              | `GET /registers`                                   |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Returns the registered citizens. It is the population data mentioned in the web front-end.` |

| **HTTP Request**              | `GET /generate-identifiers`                        |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Generates and returns a list containing a unique identifier for each citizen registered for the election and makes the relation with the electoral Id. All this process is strictly encrypted.` |

| **HTTP Request**              | `POST /add-candidate`                              |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`name, code, party, acronym, photo, status`*     |
| **Description**               | `Registers a candidate and returns the updated list of candidates.` |

| **HTTP Request**              | `POST /add-user`                                  |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`name, username, password, role`*                |
| **Description**               | `Returns a list of candidates.`                   |

| **HTTP Request**              | `GET /candidates`                                 |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Returns a list of candidates.`                   |

| **HTTP Request**              | `GET /clear-candidates`                            |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Erases the candidates registered and returns an empty object.` |

| **HTTP Request**              | `GET /announcement`                               |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Returns the announcement object set by the election committee publicly.` |

| **HTTP Request**              | `POST /deploy-announcement`                        |
|-------------------------------|----------------------------------------------------|
| **Body**                      | *`Empty`*                                          |
| **Description**               | `Stores the announcement settings in the smart contract.` |

## Error cases

When we perform `HTTP` requests to the endpoints of our blockchain, as described in section [blockchain-routes](#sec-blockchain-routes), different error codes are returned. 

| **Response code** | **Description** |
|-------------------|-----------------|
| `200 OK`          | Request accepted and authorized. |
| `201 Created`     | Indicates that the request has succeeded and a new entity has been created successfully. |
| `409 Conflict`    | The entity to be created is already existing in the system database. |
| `401 Unauthorized`| Request restricted to certain clients. The client may repeat the request with a suitable Authorization header field. |
| `400 Bad Request` | In case any other error occurs. |

## Installation of EAS CLI

To install a specific version of EAS CLI, use:

```shell
# Installation of eas version 8.0.0
npm install -g eas-cli@8.0.0

# Installation of the latest eas version
npm install -g eas-cli@latest
```

To check the version:
```shell
eas --version
# Sample output
eas-cli/8.0.0 darwin-arm64 node-v22.1.0
```

## Log in to your Expo account
To log in:
```shell
eas login
```

To check whether the login was successful:
```shell
eas whoami
# Sample output
alfredomartins
````

## Configure the project
To configure an Android or iOS project for EAS Build:

```shell
eas build:configure
```

When the command is executed, it will ask for the platform(s) in which you need to build. A file `eas.json` will be created and it would look like this:

```shell
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

It defines three build profiles named "development", "preview", and "production" (you can have multiple build profiles like "production", "debug", "testing", etc.) for each platform. More details about this file and how to set your own configurations can be found at Expo EAS JSON Documentation.

## Run a build

In our scenario, we will not use Build for app stores since it would require us to have a Google Play Store or Apple App Store membership account. This process may be done in the future, but we will not proceed in this way during this release. It would require many costs for the developer while the project is still under testing, as this is a very serious process in the country.

### Build for app stores

```shell
# Build for Android
$ eas build --platform android

# Build for iOS
$ eas build --platform ios

# Build for both
$ eas build --platform all
```

These commands can take a while, so one can check if it is done executing the command:

```shell
$ eas build:list
```

### Build APKs for Android Emulators and devices
Check the file configuration at this link https://docs.expo.dev/build-reference/apk/.

```shell
$ eas build -p android --profile <profile-name>

# Install on the emulator
$ eas build:run -p android

# Run the latest build
$ eas build:run -p android --latest
```

### Build for iOS Simulators

Check the file configuration at [this link](https://docs.expo.dev/build-reference/simulators/).

```shell
$ eas build -p ios --profile <profile-name>

# Install on the emulator
$ eas build:run -p ios

# Run the latest build
$ eas build:run -p ios --latest
```

Remember that a profile can be named whatever you like. In the above example, it is called preview. However, you can call it local, simulator, or whatever makes the most sense source.

In this particular thesis, we worked with the build of iOS simulator to speed our process up.

One can also check the multiple builds on the [Expo project page](https://expo.dev/accounts/<username>/projects/election-blockchain-angola/builds).

![Android and iOS Builds](public/images/build/builds.png)

## Backend Build

```shell
$ npm run build
```
This command will optimize the project and prepare it for deployment.

## Web Build

Similar to the last one.

```shell
$ vite build
```

# Containerization

## Directory
```perl
[back-end]/Dockerfile
```

## Dockerfile Overview

The `Dockerfile` is a plain text file without a specific extension, consisting of a set of instructions. Docker uses this file to construct a container image. In the root directory, alongside the `package.json` file, generate a file called `Dockerfile` ([source](https://docs.docker.com/engine/reference/builder/)).

We created our container images using Docker. Please refer to the source code for more details on the commands used. The setup is illustrated below.

Note: This feature is applicable only for the Web Front-end and Back-end. The Mobile application is provided in a package (e.g., `.apk` for Android). Below is a brief implementation of how to create the image for the back-end.

## Building the Docker Image

Assuming Docker is already running on the machine, build the image by running the following command:

```bash
# docker build -t <image_name> <directory_path>
$ docker build -t api_angola .
```

## Sample Output
```bash
[+] Building 32.5s (14/14) FINISHED        docker:desktop-linux
 => [internal] load build definition from Dockerfile
 => =>  transferring dockerfile: 669B
 => [internal] load metadata ...
 => [auth] library/node:pull token for registry-1.docker.io
 => [internal] load .dockerignore
 ...
 => [2/8] WORKDIR /usr/app
 => [3/8] COPY package*.json ./
 => [4/8] COPY . .
 ...
 => [8/8] RUN npm run build
 => exporting to image
 => => exporting layers
 => => writing image sha256: ...
 => => naming to docker.io/library/api_angola
```

The `-t` flag allows us to specify a desired name for the image being built.

## Running the Docker Container

With the image created, you can create and run a container using the following command:

```bash
# docker run -e SERVER_PORT=<port_number> --name <container_name> <image_name>
$ docker run -e SERVER_PORT=3010 --name container_1 api_angola
```
## Sample Output
```bash
SOCKET: listening on *: 3010 | NODE ADDRESS: 3010
Press "M" or "m" to open the menu.

# Check if running
$ docker ps
```

A container is a standardized module of software that bundles code and its dependencies, ensuring fast and reliable execution of the application across various computing environments (source).

# Technologies


# License