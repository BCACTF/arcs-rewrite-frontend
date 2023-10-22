# ARCS Frontend


## What is ARCS?

ARCS is the CTF framework created and maintained by the BCA CTF Club.

This repository contains the frontend section of the ARCS framework.

For more information on the overall framework, see `this document`. <!-- TODO: actually link the other README --> 


## Frontend Overview

The frontend is a Next.js application used to serve as a layer between the
participants and the [webhook server](https://github.com/BCACTF/arcs-webhook).

The webhook server acts as the single "source of truth" for the entire
framework, and the ARCS team decided that giving unpredictable users as little
access to the most critial part of the infrastructure would be the best idea.

Given that the webhook server is the source of truth, that means that it also
has exclusive access to the main SQL database. This means that for the sake of
speed, the frontend maintains its own cache.

This means that the frontend is composed of 3 main parts:
- The user view
- The user-facing API
- The cache


### The User View

More information on the User View can be found
[here](documentation/USER_VIEW.md).

### The User-facing API

More information on the User-facing API can be found
[here](documentation/USER_API.md).

### The Cache

More information on the Cache can be found [here](documentation/CACHE.md).



## How to use the frontend

Instructions on how to run the frontend can be found
[here](documentation/USAGE.md).

