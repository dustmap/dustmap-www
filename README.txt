What is this?
-------------

This is part of the dustmap project, see more on dustmap.org.

This special part is the single site webapp; which talks to the api service
(dustmap/dustmap-server) and brings a nice interface to the users browser.


How to install and run
----------------------

1.) install the package

    $ npm install dustmap/dustmap-www

2.) install the package's dependencies

    $ npm install

3.) install the bower stuff

    $ bower install

4.) change the API endpoint URL (see: dustmap/dustmap-server)

    $ $EDITOR public_dev/scripts/app/settings.js

5.) start it!
    if the NODE_ENV is 'prod', the requirejs stuff get minified/combined/...

    $ NODE_ENV=[dev|prod] npm start



How to implement stuff / What is this 'public', 'public_dev', 'public_prod'?
----------------------------------------------------------------------------

public/...
  There should live the whiole static stuff the server should server;
  independent of the current environment (prod or dev).

public_dev/...
  Here probably the most interessting stuff is located. There is the config
  for requirejs (require.js, main.js, build.js), the whole library stuff
  (vendor/...) and the actual application code (scripts/...).\
  The former mentioned public/ directory gets overlayed by this directory in
  development environment.

public_prod/...
  This directory get created on 'bash build.sh' if its not there already ...
  When calling 'bash build.sh' all the code gets minified and combined
  somewhere in this directory. When running the server in the production
  environment the public/ directory gets overlayed with this directory and
  the server can serve all the nice minified and combined stuff.
  Notice: When running in production the former public_dev/ doesn't get
  served.

So how to implement stuff? Code in public_dev/ and then use build.sh
to put your code into production mode (and into public_prod/).


How to install new javascript stuff
-----------------------------------

1.) install it with bower (or any other package manager or,
    if there is a good reason for, by hand)

    $ bower install --save the_cool_lib

2.) If needed, compile the installes bower components

    $ cd bower_components/the_cool_lib && jake

3.) link the library to the development web directory

    $ cd public_dev/vendor
    $ ln -s ../../bower_components/the_cool_lib/dist the_cool_lib

4.) add it to the require config

    $ cd public_dev/scripts
    $ $EDITOR main.js build.js

5.) Use the new library while in development stage (include js in your
    documents and in other scripts, use css coming with the new module)

6.) when going into production build the require stuff and start the
    server in production mode

    $ bash build.sh
    $ NODE_ENV=prod node .

    or

    $ NODE_ENV=prod npm start

