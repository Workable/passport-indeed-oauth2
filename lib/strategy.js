const Strategy = require('passport-oauth2');
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;
/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`      Indeed application's App ID
 *   - `clientSecret`  Indeed application's App Secret
 *   - `callbackURL`   URL to which Indeed will redirect the user after granting authorization
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */

class IndeedStrategy extends Strategy {
  constructor(options = {}, verify) {
    options.authorizationURL = options.authorizationURL || 'https://secure.indeed.com/oauth/v2/authorize';
    options.tokenURL = options.tokenURL || 'https://apis.indeed.com/oauth/v2/tokens';

    super(options, verify);

    this.name = 'indeed';
    this._profileUrl = options.profileUrl || 'https://secure.indeed.com/v2/api/userinfo';
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  authorizationParams(options) {
    const params = {};
    if (options.prompt) params.prompt = options.prompt;
    return params;
  }

  tokenParams(options) {
    const params = {};
    if (options.employer) params.employer = options.employer;
    return params;
  }

  userProfile(accessToken, done) {
    this._oauth2.get(this._profileUrl, accessToken, function(err, body, _res) {
      if (err) {
        return done(
          new InternalOAuthError('Failed to fetch user profile', err)
        );
      }

      let profile;
      try {
        profile = JSON.parse(body);
      } catch (ex) {
        return done(new Error('Failed to parse user profile'));
      }
      done(null, profile);
    });
  }

  authenticate(req, options) {
    options = { ...options, employer: req.query.employer };
    super.authenticate(req, options);
  }
}

module.exports = IndeedStrategy;
