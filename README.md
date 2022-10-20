# passport-indeed-oauth2

[Passport](http://passportjs.org/) strategy implemeting Indeed's Oauth2 authentication.  
This module supports custom functionality like retrieving the user profile from Indeed
and provides helpers in order to implement Indeed's "Represent an employer" flow.


## Installation

```bash
$ npm install passport-indeed-oauth2
```

## Usage

#### Basic Usage

Basic usage matches usage of:
https://github.com/jaredhanson/passport-oauth2

It is assumed that you have already registed a new OAuth 2.0 application with Indeed on:  
https://secure.indeed.com/account/apikeys/register  
Those credentials should be supplied as options when initialising the strategy as `clientId` and `clientSecret`

The default URLs to authorize are already contained in the strategy and shouldn't have to be overriden:  
authorizationURL: https://secure.indeed.com/oauth/v2/authorize  
tokenURL: https://apis.indeed.com/oauth/v2/tokens  
profileUrl: https://secure.indeed.com/v2/api/userinfo  

Example:

```javascript
passport.use(new IndeedStrategy({
    clientId: INDEED_CLIENT_ID,
    clientSecret: INDEED_CLIENT_SECRET,
    callbackURL: "http://yourapp.io/auth/indeed/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // profile follows the same structure as: https://developer.indeed.com/docs/authorization/3-legged-oauth#user-info
    User.findOrCreate({ indeed_id: profile.sub }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'indeed'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/indeed',
  passport.authenticate('indeed'));

app.get('/auth/indeed/callback',
  passport.authenticate('indeed', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

#### Representing an employer
When redirecting the user to Indeed you can add the `&prompt=select_employer` query param which will prompt the user to select their employer.  
When Indeed redirects back to your `callbackURL`, it will include the id of the employer that the user has selected as an `employer` query param.  
Pass this `employer` param as an option to the `passport.authenticate` call and the strategy will add it as a param to the body of the request made in order to retrieve the token.  
The resulting token will have the ability to "represent an employer"
  
Indeed should be the point of contact regarding updated documentation and details regarding this flow.
That said here are some tips for the implementor that are valid at the time:

* Indeed requires that you also include this param when *refreshing* a token, if you also want your new token to represent an employer.
For this case you can access the employer id of a specific token by JWT decoding it, and accessing the field in this fashion:
`const employerId = JWT.decode(token).payload.emp;`

* Indeed does not guarantee that an employer id will be returned when the `select_employer` prompt is used.
If this user is not part of any employer accounts they can proceed without selecting an employer.
If representing an employer is required for the flow you're trying to implement, your application must handle this lack of employer id and present the user with a releavant error asking that they join an employer account and reauthenticate in order to proceed.

## License

[MIT License](LICENSE)
